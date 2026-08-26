"use client";
import { fetchTrips, tripSelect } from "@/services/client/trip.client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setTripsData } from "@/redux/slices/trip.slice";
import ItineraryCard from "./itinenary-card";

const ItineraryCardWrapper = () => {
  const [tripsData, setTrips] = useState<tripSelect[]>([]);
  const dispatch = useAppDispatch();

  const fetchTripsData = async () => {
    const { trips } = await fetchTrips();
    setTrips(trips);
    dispatch(setTripsData(trips))
    console.log({ trips });
  };

  useEffect(() => {
    fetchTripsData();
  }, []);

  return (
    <section className="flex w-full flex-wrap gap-5 my-10">
      {tripsData?.map((trip: tripSelect) => (
        <ItineraryCard
          key={trip.id}
          tripData={trip}
        />
      ))}
    </section>
  );
};

export default ItineraryCardWrapper;
