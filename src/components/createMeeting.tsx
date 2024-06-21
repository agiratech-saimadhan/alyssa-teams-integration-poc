import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useState } from "react";

const createMeeting = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        variant={"outline"}
        disabled={loading}
        className="text-2xl p-8 rounded-full"
      >
        {loading ? (
          <ReloadIcon className="mr-4 h-8 w-8 animate-spin" />
        ) : (
          <PlusIcon className="mr-4 h-8 w-8" />
        )}
        Create Meeting
      </Button>
    </>
  );
};

export default createMeeting;
