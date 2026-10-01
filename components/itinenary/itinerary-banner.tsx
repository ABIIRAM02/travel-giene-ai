
const ItineraryBanner = ({ travelGroup, spotsCount, days, budget }: any) => {
  const InfoItem = () => {
    const infoItemData = [
      {
        title: "Number of Days",
        value: days,
      },
      {
        title: "Travellers",
        value: travelGroup,
      },
      {
        title: "Budget",
        value: budget.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0, 
              }),
      },
      {
        title: "Total number of spots",
        value: spotsCount,
      },
    ];

    return (
      <div className="h-20 flex">
        {infoItemData.map((item, index) => (
          <div
            className={`flex gap-3 w-1/4 h-full pl-6 items-center ${index == 3 ? "border-none" : "border-r"}`}
          >
            <div className="rounded-full p-5 bg-primary-icon-background"></div>
            <div className="flex flex-col  justify-center">
              <p className="text-[11px] text-muted-foreground">{item.title}</p>
              <p className="text-base font-medium capitalize">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="mt-4 h-80 w-full rounded-2xl border border-border shadow-sm flex flex-col">
      <span className="flex-1"></span>
      <InfoItem />
    </section>
  );
};

export default ItineraryBanner;
