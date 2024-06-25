import { ClipboardCopyIcon, PlusCircledIcon } from "@radix-ui/react-icons";
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

export default function MeetingCard() {
  const [isSignedIn] = useIsSignedIn();
  const [meetings, setMeetings] = useState<string[]>([]);

  const graphClient = Providers.globalProvider.graph.client;

  async function createMeeting() {
    try {
      if (isSignedIn) {
        const user = await graphClient.api("/me").get();
        const userID = user.id;
        console.log(userID);

        setMeetings([...meetings, "https://example.com"]);

        const meeting = await graphClient
          .api(`/users/${userID}/onlineMeetings`)
          .post({
            startDateTime: new Date().toISOString(),
            endDateTime: new Date(new Date().getTime() + 3600 * 1000),
          });
        console.log(meeting);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader className="flex flex-row w-full justify-between items-center">
        <CardTitle>
          <h3 className="text-2xl font-bold">Meetings</h3>
        </CardTitle>
        <Login loginView={"avatar"} />
      </CardHeader>
      <CardContent>
        <ul>
          {meetings.map((meeting) => (
            <li
              key={meeting}
              className="flex flex-row gap-4  justify-between items-center p-4 m-2 bg-gray-800/50 rounded-lg shadow-md"
            >
              <a href={meeting} target={"_blank"}>
                {meeting}
              </a>
              <div className="flex flex-row  justify-end items-center">
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    navigator.clipboard.writeText(meeting).then(() => {
                      alert("Copied to clipboard");
                    });
                  }}
                >
                  <ClipboardCopyIcon />
                </Button>
                <Button variant={"link"}>
                  <a
                    href={meeting}
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
          disabled={!isSignedIn}
          onClick={createMeeting}
        >
          <PlusCircledIcon className="w-5 h-5" />
          Create Meeting
        </Button>
      </CardFooter>
    </Card>
  );
}
