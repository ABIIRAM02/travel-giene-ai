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

const PlannerForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof tripSchema>, any, z.output<typeof tripSchema>>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      interests: [],
    },
  });

  const router = useRouter();

  const [travelStyleCollection, setTravelStyleCollection] =
    useState(TRAVEL_STYLE);
  const [travelGroup, setTravelGroup] = useState("");
  const [interests, setInterests] = useState([]);

  const handleTravelStyleCollection = (label: string) => {
    setTravelStyleCollection((prev) =>
      prev.map((style) =>
        style.label === label ? { ...style, selected: !style.selected } : style,
      ),
    );
  };

  const handleGenerate = async (data: TripInput) => {
    try {
      await generateTrip(data);
      router.push("/dashboard/my-trips");
    } catch (error) {
      console.log({ plannerError: error });
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
              key={input.label}
              label={input.label}
              icon={input.icon}
              type={input.type}
              error={errors[input.label as keyof TripInput]?.message}
              {...register(
                input.label as keyof TripInput,
                input.type === "number" ? { valueAsNumber: true } : undefined,
              )}
            />
          ))}
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

        <div className="flex gap-5 justify-between w-full">
          <div className="flex flex-col gap-2 w-full">
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
                className="w-full rounded-[10px] cursor-pointer border border-gray-300 p-2.5 text-left text-base"
              >
                {travelGroup || (
                  <span className="text-gray-500 text-sm">
                    Select travel campanion
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  className="p-2"
                  value={travelGroup}
                  onValueChange={(value) => {
                    setTravelGroup(value);
                    setValue("travelGroup", value, { shouldValidate: true });
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
            label="interests (optional)"
            icon="L"
            value={interests}
            error={errors?.interests?.message}
            onChange={handleInterestsValues}
          />
        </div>

        <GradintWrapper
          disabled={isSubmitting}
          type="submit"
          classname="py-4 px-8 text-base"
          option={{ icon: "L", name: "Generate Trip" }}
        />
      </form>
    </section>
  );
};

export default PlannerForm;
