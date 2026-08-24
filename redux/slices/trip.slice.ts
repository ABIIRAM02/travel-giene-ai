import { tripSelect } from "@/services/client/trip.client";
import { createSlice } from "@reduxjs/toolkit";

interface tripsState {
  tripsData: tripSelect[] | [];
}

const initialState: tripsState = {
  tripsData: [],
};

const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {

    setTripsData(state, action) {
      state.tripsData = action.payload;
    }
    
  },
});

export const { setTripsData } = tripSlice.actions;

export default tripSlice.reducer;
