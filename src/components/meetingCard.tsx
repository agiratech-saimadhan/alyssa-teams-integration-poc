import {
  ClipboardCopyIcon,
  PlusCircledIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Login, Providers, useIsSignedIn } from "@microsoft/mgt-react";
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
}

export default function MeetingCard() {
  const [isSignedIn] = useIsSignedIn();
  const [meetings, setMeetings] = useState<meeting[]>([]);
  const [loading, setLoading] = useState(false);

  const graphClient = Providers.globalProvider.graph.client;

  async function createMeeting() {
    try {
      if (isSignedIn) {
        setLoading(true);
        const user = await graphClient.api("/me").get();
        const userID = user.id;

        const meeting = await graphClient
          .api(`/users/${userID}/onlineMeetings`)
          .post({
            startDateTime: new Date().toISOString(),
            endDateTime: new Date(new Date().getTime() + 3600 * 1000),
            subject: `Meeting ${
              meetings.length + 1
            } ${new Date().toLocaleTimeString()}`,
          });

        const meetingLink = meeting.joinUrl;
        const meetingSubject = meeting.subject;

        if (meetingLink) {
          setMeetings((prev) => [
            ...prev,
            { subject: meetingSubject, link: meetingLink },
          ]);
          setLoading(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-row w-full justify-between items-center">
        <CardTitle>
          <h3 className="text-2xl font-bold">Meetings</h3>
        </CardTitle>
        <Login loginView={"avatar"} />
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
              className="flex flex-row gap-4  justify-between items-center p-4 m-2 bg-gray-800/50 rounded-lg shadow-md"
            >
              <a href={meeting.link} target={"_blank"} className="line-clamp-1">
                {meeting.subject}
              </a>
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
          disabled={!isSignedIn || loading}
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
    </Card>
  );
}
