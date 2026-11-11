"use client";

import { useEffect, useState } from "react";
import GradintWrapper from "../ui/gradient-wrapper";
import {
  PLANNER_FORM_INPUTS,
  TRAVEL_GROUPS,
  TRAVEL_STYLE,
} from "@/utils/constants";
import { useForm } from "react-hook-form";
import { TripInput, tripSchema } from "@/validators/trip.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { generateTrip } from "@/services/client/trip.client";
import { PlannerInput } from "./planner-input";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setGenerateItineraryForId } from "@/redux/slices/itinerary.slice";
import { appToastError } from "@/lib/errors/toast-error";
import { useGenerateItinerary } from "@/hooks/use-generate-itinerary";
import { Sparkles } from "lucide-react";

import { Controller } from "react-hook-form";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";

const PlannerForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof tripSchema>, any, z.output<typeof tripSchema>>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      interests: [],
    },
  });

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [travelStyleCollection, setTravelStyleCollection] =
    useState(TRAVEL_STYLE);
  const [travelGroup, setTravelGroup] = useState("");
  const [interests, setInterests] = useState([]);

  const generateMutation = useGenerateItinerary();

  const handleTravelStyleCollection = (label: string) => {
    setTravelStyleCollection((prev) =>
      prev.map((style) =>
        style.label === label ? { ...style, selected: !style.selected } : style,
      ),
    );
  };

  const handleGenerate = async (data: TripInput) => {
    try {
      const {
        trip: { id },
      }: any = await generateTrip(data);
      dispatch(setGenerateItineraryForId(id));
      router.push("/dashboard/my-trips");
      generateMutation.mutate(id);
    } catch (error) {
      appToastError(error);
    }
  };

  const handleInterestsValues = (e: any) => {
    const value = e.target.value;

    const regex = /^[A-Za-z,]*$/;
    if (value && regex.test(value)) {
      setInterests(value);
      const interestsvalue = value ? value.split(",").filter(Boolean) : [];
      setValue("interests", interestsvalue);
    }
  };

  useEffect(() => {
    const value = travelStyleCollection
      .filter((style) => style.selected)
      .map((style) => style.label);

    setValue("travelStyle", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [travelStyleCollection, setValue]);

  return (
    <section className="mt-10">
      <form
        className="flex flex-col items-start gap-5"
        onSubmit={handleSubmit(handleGenerate)}
      >
        <div className="flex gap-5 justify-between w-full">
          {PLANNER_FORM_INPUTS.map((input) => (
            <PlannerInput
              containerClassName="w-1/3"
              key={input.name}
              label={input.label}
              icon={input.icon}
              type={input.type}
              error={errors[input.name as keyof TripInput]?.message}
              {...register(input.name as keyof TripInput, {
                ...(input.type === "number" ? { valueAsNumber: true } : {}),
              })}
            />
          ))}
          <div className="flex flex-col gap-2 w-1/3">
            <div className="text-stone-500 text-xs font-medium flex gap-2 items-center">
              <span>L</span>
              <label className="capitalize" htmlFor="startDate">
                startDate
              </label>
            </div>

            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger>
                    <Button
                      type="button"
                      variant="outline"
                      className="border cursor-pointer border-gray-300 rounded-[10px] p-5.5 text-base w-full font-medium flex gap-2 items-center"
                    >
                      {field.value ? (
                        <span>
                          {format(new Date(field.value as Date), "PPP")}
                        </span>
                      ) : (
                        <span className="text-stone-500 text-xs">
                          Select your travel date
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-2" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ? new Date(field.value as Date) : undefined
                      }
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        return date < today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />

            {errors.startDate && (
              <p className="pl-1 text-sm text-red-500">
                {errors.startDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-5 w-full">
          <div className="w-1/3">
            <div className="flex items-center gap-2 flex-row-reverse">
              <Controller
                name="arrivalTime"
                control={control}
                render={({ field }) => (
                  <Input
                    type="time"
                    id="arrival-time"
                    step="60"
                    className=" flex items-center justify-center outline-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none border cursor-pointer border-gray-300 font-normal text-base"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <hr className="h-0.5 bg-accent flex-1" />
            </div>

            {errors.arrivalTime && (
              <p className="pl-1 text-sm text-red-500">
                {errors.arrivalTime.message}
              </p>
            )}
          </div>

          <span className="text-stone-500 text-xs font-medium flex gap-2 items-center ">
            Arrival Time & Departure Time (optional)
          </span>

          <div className="w-1/3">
            <div className="flex items-center gap-2">
              <Controller
                name="departureTime"
                control={control}
                render={({ field }) => (
                  <Input
                    type="time"
                    id="departure-time"
                    step="60"
                    className="flex items-center justify-center outline-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none border cursor-pointer border-gray-300 font-normal text-base"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <hr className="h-0.5 bg-accent flex-1" />
            </div>

            {errors.departureTime && (
              <p className="pl-1 text-sm text-red-500">
                {errors.departureTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full gap-5">
          <PlannerInput
            containerClassName="w-1/3"
            label="budget per person"
            icon="L"
            type="number"
            error={errors?.budget?.message}
            {...register("budget" as keyof TripInput, {
              ...{ valueAsNumber: true },
            })}
          />

          <div className="flex flex-col gap-2 w-1/3">
            <label
              className="text-stone-500 text-xs font-medium"
              htmlFor="travelGroup"
            >
              Travel group
            </label>
            <input type="hidden" {...register("travelGroup")} />
            <DropdownMenu>
              <DropdownMenuTrigger
                id="travelGroup"
                className="w-full rounded-[10px] cursor-pointer border border-gray-300 p-3 text-left text-base"
              >
                {travelGroup || (
                  <p className="text-stone-500 text-xs font-medium text-center">
                    Select travel campanion
                  </p>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  className="p-2"
                  value={travelGroup}
                  onValueChange={(value) => {
                    setTravelGroup(value);
                    setValue("travelGroup", value, { shouldValidate: true });
                    if (value === "Solo" || value === "Couple") {
                      setValue("travelers", undefined);
                    }
                  }}
                >
                  {TRAVEL_GROUPS.map((group) => (
                    <DropdownMenuRadioItem
                      className="text-base p-2 cursor-pointer"
                      key={group}
                      value={group}
                    >
                      {group}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {errors?.travelGroup && (
              <p className="pl-1 text-sm text-red-500">
                {errors?.travelGroup.message}
              </p>
            )}
          </div>

          <PlannerInput
            disabled={travelGroup === "Solo" || travelGroup === "Couple"}
            containerClassName="w-1/3"
            label="Number of travelers (optional)"
            icon="L"
            type="number"
            error={errors?.travelers?.message}
            {...register("travelers" as keyof TripInput, {
              ...{ valueAsNumber: true },
            })}
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <label
            className="text-stone-500 text-xs font-medium flex gap-2 items-center"
            htmlFor="Travel style"
          >
            Travel style
          </label>
          <div className="flex justify-between gap-3 w-full ">
            {travelStyleCollection.map((style) => (
              <GradintWrapper
                type="button"
                key={style.label}
                selected={style.selected}
                onClick={() => handleTravelStyleCollection(style.label)}
                classname="w-35 border border-gray-300 "
                option={{ icon: style.icon, name: style.label }}
              />
            ))}
          </div>
        </div>

        <PlannerInput
          containerClassName="w-full"
          label="interests (optional)"
          icon="L"
          value={interests}
          error={errors?.interests?.message}
          onChange={handleInterestsValues}
        />

        <GradintWrapper
          disabled={isSubmitting}
          type="submit"
          classname="py-4 px-8 text-base"
          option={{ icon: Sparkles, name: "Generate Trip" }}
          isBig={true}
        />
      </form>
    </section>
  );
};

export default PlannerForm;
