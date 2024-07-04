import MeetingCard from "./meetingCard";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function Container() {
  return (
    <Tabs
      defaultValue="server"
      className="grid place-items-center max-w-2xl w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger value="server" className="w-full">
          Server
        </TabsTrigger>
        <TabsTrigger value="client" className="w-full">
          Client
        </TabsTrigger>
      </TabsList>
      <TabsContent value="server" className="w-full">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="client" className="w-full">
        <MeetingCard />
      </TabsContent>
    </Tabs>
  );
}
