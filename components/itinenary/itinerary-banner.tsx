import Image from "next/image";
import { Calendar, Users, Wallet, MapPinned, MapPin } from "lucide-react";
import { IconWrapper } from "../ui/icon-wrapper";

const Tablets = ({ travelStyle }: { travelStyle: string }) => {
  return (
    <span className="glass-strong rounded-full px-3 py-1 text-xs tracking-wider font-semibold text-foreground capitalize">
      {travelStyle}
    </span>
  );
};

const ItineraryBanner = ({ tripData }: any) => {
  const {
    travelGroup,
    spotsCount,
    days,
    budget,
    coverUrl,
    destination,
    travelStyle,
    itinerary,
  } = tripData;

  console.log({ tripData });
  const InfoItem = () => {
    const infoItemData = [
      {
        title: "Number of Days",
        icon: Calendar,
        value: days,
      },
      {
        title: "Travellers",
        icon: Users,
        value: travelGroup,
      },
      {
        title: "Budget",
        icon: Wallet,
        value: budget.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
      },
      {
        title: "Total number of spots",
        icon: MapPinned,
        value: spotsCount,
      },
    ];

    return (
      <div className="h-20 flex">
        {infoItemData.map((item: any, index: number) => (
          <div
            className={`flex gap-3 w-1/4 h-full pl-6 items-center ${index == 3 ? "border-none" : "border-r"}`}
          >
            <div className="rounded-full h-11 w-11 bg-primary-icon-background flex items-center justify-center">
              <IconWrapper IconName={item.icon} />
            </div>
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
    <section className="mt-4 overflow-hidden h-96 w-full rounded-2xl border border-border shadow-sm flex flex-col">
      <div className="flex-1 relative">
        <div className="-z-9 absolute h-full w-full bg-linear-to-t from-black/25 via-black/10 to-transparent" />
        <Image
          src={coverUrl}
          alt={`${destination} image`}
          fill
          className="object-cover -z-10"
          sizes="100%"
          loading="lazy"
        />
        <div className="absolute bottom-5 left-5">
          <div className="flex flex-col items-start">
            <span className="text-white/80 uppercase rounded-sm text-xs flex gap-1 items-center">
              <MapPin className="w-4 text-accent" />
              <span>{destination}</span>
            </span>
            <h2 className="text-4xl text-secondary leading-relaxed">
              {itinerary.mainTitle}
            </h2>
            {travelStyle?.length > 0 && (
              <div className="flex gap-2">
                {travelStyle.map((data: string) => (
                  <Tablets travelStyle={data} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <InfoItem />
    </section>
  );
};

export default ItineraryBanner;
