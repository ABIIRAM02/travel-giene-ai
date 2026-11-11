import { LivePlace } from "./types";


const EXCLUDED_NAME_KEYWORDS = [
  "parking",
  "car park",
  "parking area",
  "stay place",
  "resort",
  "hotel",
];

const ALLOWED_CATEGORIES = [
  "attraction",
  "viewpoint",
  "peak",
  "park",
  "museum",
  "waterfall",
  "natural",
];

export function filterPlaces(places: LivePlace[]): LivePlace[] {
  return places.filter((place) => {
    const name = place.name.toLowerCase().trim();
    const category = place.category.toLowerCase().trim();

    const isAllowedCategory = ALLOWED_CATEGORIES.includes(category);

    const isExcludedName = EXCLUDED_NAME_KEYWORDS.some((keyword) =>
      name.includes(keyword),
    );

    return isAllowedCategory && !isExcludedName;
  });
}
