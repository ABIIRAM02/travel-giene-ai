import { useRouter } from "next/navigation";


type tripSelect = {
  id: string;
  destination: string;
  days: number;
  budget: number;
  travelStyle: string[];
  travelGroup: string;
  interests: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
};

interface itineraryProps {
  tripData: tripSelect
}

const ItineraryCard = ({ tripData }: itineraryProps) => {

  const { destination, travelGroup, id } = tripData;

    const router = useRouter();

    const handleOpenItinerary = () => {
        router.push(`/dashboard/my-trips/${id}`);
    };

  return (
    <section className="w-full shrink-0 rounded-2xl flex flex-col h-70 hover-lift md:w-[calc((100%_-_3rem)_/_3)]">
      <div className="h-1/2 border rounded-t-2xl relative">
        <span className="absolute bottom-3 font-semibold px-5">
          {destination}
        </span>
      </div>
      <div className="h-1/2 border rounded-b-2xl p-4 flex flex-col justify-between">
        <span className="text-center">{travelGroup}</span>
        <button onClick={handleOpenItinerary} className="p-3 font-semibold rounded-full w-full bg-secondary cursor-pointer">
          Open itinerary
        </button>
      </div>
    </section>
  );
};

export default ItineraryCard;
