import { deleteTripById } from "@/services/client/trip.client";
import { useRouter } from "next/navigation";
import { appToast } from "../ui/toaster";
import { Trash2 } from "lucide-react";
import { tripSelect } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";


interface itineraryProps {
  tripData: tripSelect;
}

const ItineraryCard = ({ tripData }: itineraryProps) => {
  const { destination, travelGroup, id, itineraryStatus } = tripData;
  
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleOpenItinerary = () => {
    router.push(`/dashboard/my-trips/${id}`);
  };

  const handleTripDelete = async () => {
    const { message } = await deleteTripById(id);
    queryClient.invalidateQueries({ queryKey: ["trips"] });
    appToast.success({
      title: message,
      closeButton: true,
    });
  };

  return (
    <section className="w-full shrink-0 rounded-2xl flex flex-col h-70 hover-lift md:w-[calc((100%-3rem)/3)] border border-border bg-card ">
      <div className="h-1/2 border rounded-t-2xl relative bg-sidebar-accent">
        <div className="absolute right-5 top-5" >
          <button
          type="button"
          aria-label="Delete trip"
          title="Delete trip"
          onClick={handleTripDelete}
          className="glass group/delete flex h-8 w-8 items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-destructive/90 hover:border-destructive hover:text-white"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
        </div>
        <span className="absolute bottom-3 font-semibold px-5">
          {destination}
        </span>
      </div>
      <div className="h-1/2 border rounded-b-2xl p-4 flex flex-col justify-between">
        <span className="text-center">{travelGroup}</span>
        <button
          disabled={itineraryStatus !== "COMPLETED"}
          onClick={handleOpenItinerary}
          className="p-3 font-semibold rounded-full w-full bg-secondary cursor-pointer"
        >
          {itineraryStatus === "COMPLETED" ? "Open itinerary" : itineraryStatus}
        </button>
      </div>
    </section>
  );
};

export default ItineraryCard;
