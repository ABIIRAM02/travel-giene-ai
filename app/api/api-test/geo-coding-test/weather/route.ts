import { getDestinationCoordinates } from "@/lib/live-data/geo-coding";
import { getWeatherForecast } from "@/lib/live-data/weather";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { latitude, longitude } =
      await getDestinationCoordinates("Munnar, kerala");
    const photos = await getWeatherForecast(
      latitude,
      longitude,
      "2026-11-25",
      5,
    );

    return NextResponse.json(photos);
  } catch (error) {
    console.error("weather test failed:", error);

    return NextResponse.json(
      { message: "Failed to fetch weather" },
      { status: 500 },
    );
  }
}
