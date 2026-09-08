"use client";
import { fetchTrips, tripSelect } from "@/services/client/trip.client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setTripsData } from "@/redux/slices/trip.slice";
import ItineraryCard from "./itinerary-card";
import { generateItineraryById } from "@/services/client/itinerary.client";
import { useTripPoll } from "@/hooks/use-trip";
import { useGenerateItinerary } from "@/hooks/use-generate-itinerary";

const ItineraryCardWrapper = () => {
  const [tripsData, setTrips] = useState<tripSelect[]>([]);
  const itineraryId = useAppSelector(
    (state) => state.itinerary.generateItineraryForId,
  );
  const dispatch = useAppDispatch();

  const tripPollQuery = useTripPoll(itineraryId);
  const generateMutation = useGenerateItinerary();

  const fetchTripsData = async () => {
    const { trips } = await fetchTrips();
    setTrips(trips);
    dispatch(setTripsData(trips));
  };

  useEffect(() => {
    fetchTripsData();
  }, []);

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

  return (
    <section className="flex w-full flex-wrap gap-5 my-10">
      {[...tripsData]?.reverse().map((trip: tripSelect) => (
        <ItineraryCard key={trip.id} tripData={trip.id === itineraryId ? (tripPollQuery.data?.trip || trip) : trip} />
      ))}
    </section>
  );
};

export default ItineraryCardWrapper;
