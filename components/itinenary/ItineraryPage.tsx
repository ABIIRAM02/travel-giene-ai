"use client";

import { fetchTripById } from "@/services/client/trip.client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ItineraryBanner from "./itinerary-banner";
import GradintWrapper from "../ui/gradient-wrapper";
import { Progress, ProgressLabel, ProgressValue } from "../ui/progress";
import { appToast } from "../ui/toaster";
import { appToastError } from "@/lib/errors/toast-error";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="shadow-sm rounded-2xl border border-border bg-card p-6">
      {children}
    </div>
  );
};

const ItineraryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [tripData, setTripData] = useState<any>({});

  const handleBackClick = () => {
    router.replace("/dashboard/my-trips");
  };

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        const { trip } = await fetchTripById(id as string);
        const spotsCount = trip?.itinerary.days.reduce(
          (acc: number, day: any) => {
            return acc + day.spots.length;
          },
          0,
        );
        setTripData({ ...trip, spotsCount });
      } catch (error) {
        appToastError(error);
      }
    };

    fetchTrip();
  }, [id]);

  if (tripData?.itineraryStatus !== "COMPLETED") return;

  return (
    <main>
      <button className="my-2 cursor-pointer" onClick={handleBackClick}>
        Back to trips
      </button>

      <ItineraryBanner
        spotsCount={tripData.spotsCount}
        days={tripData.days}
        budget={tripData.budget}
        travelGroup={tripData.travelGroup}
      />

      <section className="flex gap-6 mt-8">
        <section className="flex flex-col gap-6 flex-1">
          <Container>
            <div className="flex flex-col gap-3">
              <p className="text-base font-semibold">Trip Summary</p>
              <span className="text-muted-foreground text-xs leading-relaxed">
                {tripData.itinerary.summary}
              </span>
            </div>
          </Container>

          {tripData.itinerary.days.map((day: any) => (
            <Container>
              <section className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-sm font-semibold text-white">
                  D{day.day}
                </div>
                <h5 className="text-base font-semibold flex-1">{day.title}</h5>
                <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                  {day.spots.length} spots
                </span>
              </section>

              {day.spots.map((spot: any) => (
                <section className="pl-5 flex flex-col mt-5">
                  <section className="flex gap-5 items-center">
                    <div className="flex flex-col gap-1">
                      <h5 className="text-xs font-semibold tabular-nums">
                        {spot.time}
                      </h5>
                      <span className="text-[11px] text-muted-foreground capitalize">
                        {spot.type}
                      </span>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent"></div>

                    <div className="flex-1">
                      <h5 className="font-semibold text-primary">
                        {spot.title}
                        <span className="text-secondary-foreground rounded-full bg-secondary px-2 py-1 text-[11px] font-semibold ml-1">
                          {spot.location}
                        </span>
                      </h5>
                      <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {spot.description}
                      </span>
                    </div>

                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold">
                      ₹ {spot.fee}
                    </span>
                  </section>
                </section>
              ))}
            </Container>
          ))}
        </section>

        <section className="flex flex-col gap-6 w-96">
          <Container>
            <p className=" font-semibold">Budget breakdown</p>

            <div className="flex flex-col gap-4 mt-5">
              {Object.entries(tripData.itinerary.budget.breakdown).map(
                ([key, value]) => (
                  <Progress
                    key={key}
                    value={value as number}
                    max={tripData.itinerary.budget.total}
                    className="w-full max-w-sm"
                  >
                    <ProgressLabel className="capitalize">{key}</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                ),
              )}
            </div>
          </Container>

          <section className="flex flex-col gap-1 p-6">
            <h4 className="font-semibold">Ask TravelGenie</h4>
            <span className="text-xs text-muted-foreground">
              Want a slower day 3, or swap dinners for street food? Regenerate
              any day instantly.
            </span>
            <GradintWrapper
              classname="text-xs shadow-glow justify-center mt-3"
              option={{ name: "Refine this itinerary" }}
            />
          </section>
        </section>
      </section>
    </main>
  );
};

export default ItineraryPage;
