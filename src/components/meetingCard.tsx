import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Login, Providers, useIsSignedIn } from "@microsoft/mgt-react";
import { useEffect, useState } from "react";

export default function MeetingCard() {
  const [isSignedIn] = useIsSignedIn();

  const graphClient = Providers.globalProvider.graph.client;

  async function createMeeting() {
    try {
      if (isSignedIn) {
        const user = await graphClient.api("/me").get();
        const userID = user.id;
        console.log(userID);

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
      <CardContent></CardContent>
      <CardFooter>
        <Button
          className="w-full flex gap-4 text-xl rounded-full"
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
