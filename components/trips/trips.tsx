import ItineraryCardWrapper from "./itinerary-card-wrapper";


const Trips = () => {

  return (
    <section>
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-medium">My Trips</h2>
        <p className="text-gray-500">
          Every itinerary TravelGenie has crafted for you — organised and ready
          to edit.
        </p>
      </div>
      <ItineraryCardWrapper />
    </section>
  );
};

export default Trips;
