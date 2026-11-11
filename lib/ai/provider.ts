
import { google } from "@ai-sdk/google";

export const models = {
  fast: google("gemini-3.5-lite"), 
  
  // smart: google("gemini-3.5-flash-lite"),
  smart: google("gemini-3.7-flash"),
  
  deep: google("gemini-3.7-flash"), 
};