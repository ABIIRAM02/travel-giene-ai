"use client";

import { fetchTripById } from "@/services/client/trip.client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Itinerary = () => {
  const { id } = useParams();
  const router = useRouter();
  const [tripData, setTripData] = useState({});

  console.log({id})

  const handleBackClick = () => {
    router.replace("/dashboard/my-trips");
  };

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        const { trip } = await fetchTripById(id as string);
        setTripData(trip);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTrip();
  }, [id]);

  return (
    <div>
      <button className="my-10 cursor-pointer" onClick={handleBackClick}>
        Back to trips
      </button>
      <pre>{JSON.stringify(tripData, null, 2)}</pre>
    </div>
  );
};

export default Itinerary;
