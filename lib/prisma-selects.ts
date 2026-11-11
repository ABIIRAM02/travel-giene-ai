export const userSelect = {
  id: true,
  name: true,
  email: true,
  plan: true,
  credits: true,
} as const;

export const tripSelect = {
  id: true,
  destination: true,
  days: true,
  budget: true,
  travelStyle: true,
  travelGroup: true,
  interests: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  itineraryStatus: true,
  itinerary: true,
  startDate: true,
  travelers: true,
  arrivalTime: true,
  departureTime: true,
  thumbnailUrl: true,
  coverUrl: true,
  imageUrl: true,
  imagePhotographer: true,
  imagePhotographerUrl: true
};
