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
  createdAt: true,
  updatedAt: true,
} as const;
