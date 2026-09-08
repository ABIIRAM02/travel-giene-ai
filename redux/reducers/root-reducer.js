import { combineReducers } from "@reduxjs/toolkit";
import authSlice from '../slices/auth.slice'
import tripSlice from '../slices/trip.slice'
import itinerarySlice from '../slices/itinerary.slice'

export const rootReducer = combineReducers({
    auth : authSlice,
    trip : tripSlice,
    itinerary : itinerarySlice,
})