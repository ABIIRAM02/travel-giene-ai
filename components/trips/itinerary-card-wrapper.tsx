"use client";
import { fetchTrips } from "@/services/client/trip.client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setTripsData } from "@/redux/slices/trip.slice";
import ItineraryCard from "./itinerary-card";
import { generateItineraryById } from "@/services/client/itinerary.client";
import { useTripPoll } from "@/hooks/use-trip-poll";
import { useGenerateItinerary } from "@/hooks/use-generate-itinerary";
import { appToast } from "../ui/toaster";
import { useTripFetch } from "@/hooks/use-trips-fetch";
import { tripSelect } from "@/utils/types";

const ItineraryCardWrapper = () => {
  const [tripsData, setTrips] = useState<tripSelect[]>([]);
  const itineraryId = useAppSelector(
    (state) => state.itinerary.generateItineraryForId,
  );
  const dispatch = useAppDispatch();

  const { data, isLoading, error } = useTripFetch();
  const tripPollQuery = useTripPoll(itineraryId);
  const generateMutation = useGenerateItinerary();

  // const fetchTripsData = async () => {
  //   const { trips } = await fetchTrips();
  //   setTrips(trips);
  //   dispatch(setTripsData(trips));
  // };

  useEffect(() => {
    if (data) {
      setTrips(data.trips);
      dispatch(setTripsData(data.trips));
    }
  }, [data]);

  useEffect(() => {
    if (!itineraryId) return;

    if (tripPollQuery.data?.trip?.itineraryStatus !== "PENDING") {
      return;
    }

    if (generateMutation.isPending || generateMutation.isSuccess) {
      return;
    }

    generateMutation.mutate(itineraryId);
  }, [
    itineraryId,
    tripPollQuery.data?.trip?.itineraryStatus,
    generateMutation.isPending,
    generateMutation.isSuccess,
  ]);

  useEffect(() => {
    switch (tripPollQuery.data?.trip?.itineraryStatus) {
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
          // action: {
          //   label: "Retry",
          //   onClick: () => {},
          // },
          closeButton: true,
        });
        break;
      }
      default:
        null;
    }
  }, [tripPollQuery.data?.trip?.itineraryStatus]);

  return (
    <section className="flex w-full flex-wrap gap-5 my-10">
      {[...tripsData]?.reverse().map((trip: tripSelect) => (
        <ItineraryCard
          key={trip.id}
          tripData={
            trip.id === itineraryId ? tripPollQuery.data?.trip || trip : trip
          }
        />
      ))}
    </section>
  );
};

export default ItineraryCardWrapper;
