"use client";
import { useAppSelector } from "@/redux/hooks";
import ItineraryCard from "./itinerary-card";
import { useTripPoll } from "@/hooks/use-trip-poll";
import { useTripFetch } from "@/hooks/use-trips-fetch";
import { tripSelect } from "@/utils/types";

const ItineraryCardWrapper = () => {

  const itineraryId = useAppSelector(
    (state) => state.itinerary.generateItineraryForId,
  );

  const tripPollQuery = useTripPoll();

  const { data, isLoading, error } = useTripFetch();

  return (
    <section className="flex w-full flex-wrap gap-5 my-10">
      {data?.trips.map((trip: tripSelect) => (
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
