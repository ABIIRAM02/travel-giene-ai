
import { tripSelect } from "@/services/client/trip.client";
import { createSlice } from "@reduxjs/toolkit";

interface inineraryState {
  generateItineraryForId: string | null;
}

const initialState: inineraryState = {
  generateItineraryForId: null,
};

const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {

    setGenerateItineraryForId(state, action) {
      state.generateItineraryForId = action.payload;
    }
    
  },
});

export const { setGenerateItineraryForId } = itinerarySlice.actions;

export default itinerarySlice.reducer;
