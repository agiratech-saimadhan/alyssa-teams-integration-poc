import MeetingCard from "./meetingCard";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import MeetingCardServer from "./meetingCardServer";
import { Card } from "./ui/card";

export default function Container() {
  return (
    <Card className="grid place-items-center max-w-xl w-full shadow-2xl backdrop-blur-md ">
      <Tabs
        defaultValue="client"
        className="grid place-items-center max-w-2xl w-full bg-opacity-5"
      >
        <TabsList className="w-full mb-4">
          <TabsTrigger value="client" className="w-full">
            Client
          </TabsTrigger>
          <TabsTrigger value="server" className="w-full">
            Server
          </TabsTrigger>
        </TabsList>
        <TabsContent value="client" className="w-full">
          <MeetingCard />
        </TabsContent>
        <TabsContent value="server" className="w-full">
          <MeetingCardServer />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
