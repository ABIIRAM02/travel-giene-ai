"use client";

import type { WeatherForecastDay } from "@/utils/types";
import { Slider, SliderItem } from "../ui/slider";
import { appToastError } from "@/lib/errors/toast-error";
import { appToast } from "../ui/toaster";
import { useWeatherFetch } from "@/hooks/use-weather-fetch";
import { useState } from "react";

interface weatherSliderCardProps {
  sliderRef: any;
  weatherDays: WeatherForecastDay[];
  destination: string;
  startDate: string;
  days: number;
  tripId: string;
}

const WeatherSliderCard = ({
  tripId,
  sliderRef,
  weatherDays,
  destination,
  startDate,
  days,
}: weatherSliderCardProps) => {
  const { refetch, isFetching } = useWeatherFetch({
    tripId,
    destination,
    startDate,
    days,
  });

  const [weatherData, setWeatherDays] = useState(weatherDays);

  const handleRetry = async () => {
    try {
      const { data }: any = await refetch();

      setWeatherDays(data.days);

      appToast.success({
        title: "Weather data updated successfully",
        description: data.message,
        closeButton: true,
      });
    } catch (err) {
      appToastError({message:"Something went wrong"});
    }
  };

  return (
      <Slider label="Daily weather forecast" className="mt-4" ref={sliderRef}>
        {!isFetching ? (
          weatherData?.map((day: WeatherForecastDay, index: number) =>
            day.date ? (
              <SliderItem key={day.date}>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary/70 p-3">
                  <section>
                    <div className="flex gap-1">
                      <h2 className="text-xs uppercase tracking-wide">{day.dayOfWeek}:</h2>
                      <p className="text-xs text-muted-foreground">
                        Day {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {day.condition}
                    </div>
                  </section>
                  <section className="flex gap-4 text-xs">
                    <h2>
                      <span className="mr-1 font-light text-muted-foreground">
                        L
                      </span>
                      {day.temperatureMin} °C
                    </h2>
                    <h2>
                      <span className="mr-1 font-light text-muted-foreground">
                        H
                      </span>
                      {day.temperatureMax} °C
                    </h2>
                  </section>
                </div>
              </SliderItem>
            ) : (
              <SliderItem onClick={handleRetry} className="cursor-pointer">
                <span className="text-muted-foreground text-xs">
                  {" "}
                  Data available upto 16 days from today. tab to retry{" "}
                </span>
              </SliderItem>
            ),
          )
        ) : (
          <span>Fetching...</span>
        )}
      </Slider>
  );
};

export default WeatherSliderCard;
