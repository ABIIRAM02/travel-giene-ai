
import { google } from "@ai-sdk/google";

export const models = {
  // Swapped to Gemini 3.5 Flash-Lite (fastest, most cost-effective 3.5-class model)
  fast: google("gemini-3.5-lite"), 
  
  // Updated from 2.5-flash to the recommended 3.6-flash mainline workhorse
  smart: google("gemini-3.6-flash"), 
  
  // Maintained your current deep reasoning endpoint
  deep: google("gemini-3.7-flash"), 
};