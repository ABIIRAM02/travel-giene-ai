import { WeatherForecastDay, WeatherForecastResult } from "@/utils/types";

function getWeatherCondition(code: number): string {

  const weatherConditions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherConditions[code] ?? "Unknown conditions";
};

function getDayName(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
};

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeatherForecast(
  latitude: number,
  longitude: number,
  startDate: string,
  tripDays: number
): Promise<WeatherForecastResult> {
  try {
    // Calculate trip end date using UTC to avoid timezone issues.
    const tripStart = new Date(`${startDate}T00:00:00Z`);

    if (
      Number.isNaN(tripStart.getTime()) ||
      !Number.isInteger(tripDays) ||
      tripDays <= 0
    ) {
      return {
        status: "unavailable",
        days: [],
        message: "Invalid trip dates.",
      };
    }

    const tripEnd = new Date(tripStart);
    tripEnd.setUTCDate(tripEnd.getUTCDate() + tripDays - 1);

    const endDate = tripEnd.toISOString().slice(0, 10);

    // Build Open-Meteo request.
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "weather_code",
      ].join(","),
      forecast_days: "16",
      timezone: "auto",
      temperature_unit: "celsius",
      precipitation_unit: "mm",
    });

    const response = await fetch(`${WEATHER_API_URL}?${params}`, {
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Weather API failed: ${response.status}`);
    }

    const data = await response.json();

    const daily = data.daily;

    if (
      !daily ||
      !Array.isArray(daily.time) ||
      !Array.isArray(daily.temperature_2m_max) ||
      !Array.isArray(daily.temperature_2m_min) ||
      !Array.isArray(daily.precipitation_sum) ||
      !Array.isArray(daily.weather_code)
    ) {
      throw new Error("Invalid weather API response.");
    }

    const forecastDays: WeatherForecastDay[] = daily.time
      .map((date: string, index: number) => {
        const temperatureMax = daily.temperature_2m_max[index];
        const temperatureMin = daily.temperature_2m_min[index];
        const weatherCode = daily.weather_code[index];

        // Skip incomplete forecast entries.
        if (
          !date ||
          !Number.isFinite(temperatureMax) ||
          !Number.isFinite(temperatureMin) ||
          !Number.isFinite(weatherCode)
        ) {
          return null;
        }

        // Keep only dates within the trip.
        if (date < startDate || date > endDate) {
          return null;
        }

        return {
          date,
          dayOfWeek: getDayName(date),
          temperatureMax,
          temperatureMin,
          condition: getWeatherCondition(weatherCode),
        };
      })
      .filter(
        (day: WeatherForecastDay | null): day is WeatherForecastDay =>
          day !== null
      );

    // No overlapping forecast dates.
    if (forecastDays.length === 0) {
      return {
        status: "unavailable",
        days: [],
        message: "Weather forecast is not available for these trip dates.",
      };
    }

    const status =
      forecastDays.length === tripDays ? "available" : "partial";

    return {
      status,
      days: forecastDays,
      ...(status === "partial" && {
        message: `Weather forecast available for ${forecastDays.length} of ${tripDays} trip days.`,
      }),
    };
  } catch (error) {
    console.error("[Weather] Forecast fetch failed:", error);

    return {
      status: "error",
      days: [],
      message: "Weather forecast unavailable.",
    };
  }
}