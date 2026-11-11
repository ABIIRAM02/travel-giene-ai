import { getDestinationPhotos } from "@/services/server/unsplash.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const photos = await getDestinationPhotos("Ladakh");

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Unsplash test failed:", error);

    return NextResponse.json(
      { message: "Failed to fetch destination photos" },
      { status: 500 },
    );
  }
}