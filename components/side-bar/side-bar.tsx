"use client";

import { SIDE_BAR_OPTIONS } from "@/utils/constants";
import GradintWrapper from "../ui/gradient-wrapper";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTripPoll } from "@/hooks/use-trip-poll";
import { appToast } from "../ui/toaster";
import { useGenerateItinerary } from "@/hooks/use-generate-itinerary";
import { IconWrapper } from "../ui/icon-wrapper";
import { LogOut } from "lucide-react";
import { logout } from "@/services/client/auth.client";
import { clearUser } from "@/redux/slices/auth.slice";
import { appToastError } from "@/lib/errors/toast-error";
import { useAppDispatch } from "@/redux/hooks";

const Sidebar = () => {
  const [selected, setSelected] = useState("Dashboard");
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
      router.replace("/login");
    } catch (error) {
      appToastError(error);
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
    <main className="border-r w-1/6 h-screen fixed top-0">
      <div className="h-16 border-b px-4 flex justify-center flex-col">
        <h2>TravelGenie</h2>
        <span>AI</span>
      </div>
      <p className="uppercase font-semibold text-[11px] px-7 pt-6 pb-3 text-gray-500">
        Workspace
      </p>
      <div className="flex flex-col justify-between">
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

        <div
          onClick={handleLogout}
          className="absolute bottom-0 flex items-center gap-2 mb-7 ml-7 text-sm text-muted-foreground cursor-pointer hover:text-sidebar-accent-foreground"
        >
          <IconWrapper
            IconName={LogOut}
            style={{
              color: "var(--muted-foreground)",
              height: "17px",
              width: "17px",
            }}
          />
          <span className="text-xs" >Sign out</span>
        </div>
      </div>
    </main>
  );
};

export default Sidebar;
