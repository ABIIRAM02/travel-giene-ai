"use client";

import { SIDE_BAR_OPTIONS } from "@/utils/constants";
import GradintWrapper from "../ui/gradient-wrapper";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTripPoll } from "@/hooks/use-trip-poll";
import { appToast } from "../ui/toaster";
import { useGenerateItinerary } from "@/hooks/use-generate-itinerary";

const Sidebar = () => {
  const [selected, setSelected] = useState("Dashboard");
  const router = useRouter();

  const generateMutation = useGenerateItinerary();
  const tripPollQuery = useTripPoll();

  const handleOptionSelect = (option: string) => {
    setSelected(option);
    const stringUpdate = option.replace(" ", "-").toLowerCase();
    if (option === "Dashboard") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard/${stringUpdate}`);
    }
  };

  useEffect(() => {
    switch (tripPollQuery?.data?.trip?.itineraryStatus) {
      case "PENDING": {
        appToast.info({
          title: "Ready to generate",
          description: "Your itinerary is about to be created.",
          closeButton: true,
        });
        break;
      }
      case "GENERATING": {
        appToast.info({
          title: "Creating your itinerary ✨",
          description:
            "Feel free to explore the app. We'll have your itinerary ready soon.",
          closeButton: true,
        });
        break;
      }
      case "COMPLETED": {
        appToast.success({
          title: "Itinerary Ready!",
          description:
            "Your personalized itinerary has been generated successfully.",
          duration: 15000,
          closeButton: true,
        });
        break;
      }
      case "FAILED": {
        appToast.error({
          title: "Error",
          description:
            "Something went wrong while creating your itinerary. Please try again.",
          action: {
            label: "Retry",
            onClick: () => {
              generateMutation.mutate(tripPollQuery?.data?.trip?.id as string);
            },
          },
          closeButton: true,
        });
        break;
      }
      default:
        null;
    }
  }, [tripPollQuery?.data?.trip?.itineraryStatus]);

  return (
    <main className="border-r w-1/6 fixed h-full bottom-0">
      <div className="h-16 border-b px-4 flex justify-center flex-col">
        <h2>TravelGenie</h2>
        <span>AI</span>
      </div>
      <p className="uppercase font-semibold text-[11px] px-7 pt-6 pb-3 text-gray-500">
        Workspace
      </p>
      <div className="flex flex-col justify-between h-full">
        <section className="px-4 flex flex-col gap-2">
          {SIDE_BAR_OPTIONS.map((option) => (
            <GradintWrapper
              selected={option.name === selected}
              key={option.name}
              option={option}
              onClick={() => handleOptionSelect(option.name)}
            />
          ))}
        </section>

        <span>sign out</span>
      </div>
    </main>
  );
};

export default Sidebar;
