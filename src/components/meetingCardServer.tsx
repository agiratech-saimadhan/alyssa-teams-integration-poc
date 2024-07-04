import { ClipboardCopyIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";

interface meeting {
  subject: string;
  link: string;
}

export default function MeetingCardServer() {
  const [meetings, setMeetings] = useState<meeting[]>([]);

  async function createMeeting() {
    try {
      const meeting = await fetch(
        "http://localhost:9999/.netlify/functions/create-meeting",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: `Automated Meeting ${
              meetings.length + 1
            } ${new Date().toLocaleTimeString()}`,
          }),
        }
      ).then((res) => res.json());

      const meetingLink = meeting.joinUrl;
      const meetingSubject = meeting.subject;

      if (meetingLink) {
        setMeetings((prev) => [
          ...prev,
          { subject: meetingSubject, link: meetingLink },
        ]);
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
      </CardHeader>
      <CardContent>
        <ul>
          {meetings.map((meeting) => (
            <li
              key={meeting.link}
              className="flex flex-row gap-4  justify-between items-center p-4 m-2 bg-gray-800/50 rounded-lg shadow-md"
            >
              <a href={meeting.link} target={"_blank"} className="line-clamp-1">
                {meeting.subject}
              </a>
              <div className="flex flex-row  justify-end items-center">
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    navigator.clipboard.writeText(meeting.link).then(() => {
                      alert("Copied to clipboard");
                    });
                  }}
                >
                  <ClipboardCopyIcon />
                </Button>
                <Button variant={"link"}>
                  <a
                    href={meeting.link}
                    target={"_blank"}
                    className="flex  gap-2 justify-center items-center"
                  >
                    <PlusCircledIcon />
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
          variant={"outline"}
          onClick={createMeeting}
        >
          <PlusCircledIcon className="w-5 h-5" />
          Create Meeting
        </Button>
      </CardFooter>
    </Card>
  );
}
