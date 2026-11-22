import { getDestinationCoordinates } from "@/lib/live-data/geo-coding";
import { getWeatherForecast } from "@/lib/live-data/weather";
import { updateTripById } from "@/services/client/trip.client";
import { getTodayIST } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";

export const useWeatherFetch = (params : any) => {
  const { tripId, destination, startDate, days } = params;
  const todayIST = getTodayIST();

  const { refetch, isFetching } = useQuery({
    // Including `todayIST` ensures the key stays identical all day, then resets at midnight IST
    queryKey: ["trip-weather",tripId, todayIST],
    queryFn: async () => {
      const { latitude, longitude } =
        await getDestinationCoordinates(destination);
      const weatherData = await getWeatherForecast(
        latitude,
        longitude,
        startDate,
        days,
      );
      await updateTripById(tripId, { weather: weatherData });
      return weatherData;
    },
    enabled: false,
    retry: false,
    staleTime: Infinity, // Never auto-refetch while the queryKey is the same
    gcTime: 1000 * 60 * 60 * 24, // Keep in memory for 24 hours
  });

  return {
    refetch,
    isFetching,
  };
};
