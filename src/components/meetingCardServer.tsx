import {
  ClipboardCopyIcon,
  PlusCircledIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface meeting {
  subject: string;
  link: string;
  attendee: string;
}

export default function MeetingCardServer() {
  const [meetings, setMeetings] = useState<meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function createMeeting() {
    try {
      setLoading(true);
      const meeting = await fetch(`/.netlify/functions/create-meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `Automated Meeting ${
            meetings.length + 1
          } ${new Date().toLocaleTimeString()}`,
        }),
      }).then((res) => res.json());

      const meetingLink = meeting.joinUrl;
      const meetingSubject = meeting.subject;
      const meetingAttendee = meeting.attendee;

      if (meetingLink) {
        setMeetings((prev) => [
          ...prev,
          {
            subject: meetingSubject,
            link: meetingLink,
            attendee: meetingAttendee,
          },
        ]);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  return (
    <div className=" w-full">
      <CardHeader className="flex flex-row w-full justify-between items-center">
        <CardTitle>
          <h3 className="text-2xl font-bold">Meetings</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {meetings.length == 0 ? (
          <h2 className="text-2xl font-bold text-center my-8">
            No meetings yet
          </h2>
        ) : null}

        <ul className="my-8">
          {meetings.map((meeting) => (
            <li
              key={meeting.link}
              className="flex flex-row gap-4  justify-between items-center p-4 m-2 bg-gray-800/25 rounded-lg shadow-md hover:bg-gray-800/50 hover:shadow-lg"
            >
              <div className="flex flex-col gap-1">
                <a
                  href={meeting.link}
                  target={"_blank"}
                  className="line-clamp-1"
                >
                  {meeting.subject}
                </a>
                <p className="text-xs text-gray-400"> {meeting.attendee}</p>
              </div>
              <div className="flex flex-row  justify-end items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant={"ghost"}
                        onClick={() => {
                          navigator.clipboard
                            .writeText(meeting.link)
                            .then(() => {
                              alert("Copied to clipboard");
                            });
                        }}
                      >
                        <ClipboardCopyIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy Meeting Link</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant={"link"}>
                  <a
                    href={meeting.link}
                    target={"_blank"}
                    className="flex  gap-2 justify-center items-center"
                  >
                    Join
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full flex gap-4 text-xl "
          variant={"default"}
          disabled={loading}
          onClick={createMeeting}
        >
          {loading ? (
            <ReloadIcon className="animate-spin w-5 h-5" />
          ) : (
            <PlusCircledIcon className="w-5 h-5" />
          )}
          Create Meeting
        </Button>
      </CardFooter>
    </div>
  );
}
