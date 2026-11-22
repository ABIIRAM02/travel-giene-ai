"use client";

import {
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type SliderProps = {
  children: ReactNode;
  label: string;
  className?: string;
  ref?: any;
};

function Slider({ children, label, className, ref }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: "smooth",
    });
  };

  useImperativeHandle(ref, () => ({
    prevSlide() {
      scroll(-1);
    },
    nextSlide() {
      scroll(1);
    },
  }));

  return (
    <div className={cn("space-y-2", className)}>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}

function SliderItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-w-0 flex-[0_0_100%] snap-start", className)}
      {...props}
    />
  );
}

export { Slider, SliderItem };
