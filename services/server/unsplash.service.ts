
export async function getDestinationPhotos(destination: string) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new Error("UNSPLASH_ACCESS_KEY is not configured");
  }

  const query = `iconic ${destination} wallpaper`;

  const params = new URLSearchParams({
    query,
    per_page: "1",
    orientation: "landscape",
  });

  const response = await fetch(
    `https://api.unsplash.com/search/photos?${params.toString()}`,
    {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Unsplash API request failed: ${response.status}`);
  }

  const { results } = await response.json();
  const photo = results[0];

  if (!photo) {
    return null;
  }

  try {
    const trackingResponse = await fetch(photo.links.download_location, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
    });

    if (!trackingResponse.ok) {
      console.error("Unsplash tracking failed:", trackingResponse.status);
    }
  } catch (error) {
    console.error("Unsplash tracking request failed:", error);
  }

  return {
    thumbnailUrl: photo.urls.small,
    coverUrl: photo.urls.regular,
    imageUrl: photo.links.html,
    imagePhotographer: photo.user.name,
    imagePhotographerUrl: photo.user.links.html,
  };

}
