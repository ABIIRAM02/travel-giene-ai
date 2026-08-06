import { combineReducers } from "@reduxjs/toolkit";
import authSlice from '../slices/auth.slice'

export const rootReducer = combineReducers({
    auth : authSlice
})