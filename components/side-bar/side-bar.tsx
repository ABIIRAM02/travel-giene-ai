"use client";

import { SIDE_BAR_OPTIONS } from "@/utils/constants";
import GradintWrapper from "../ui/gradient-wrapper";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [selected, setSelected] = useState("Dashboard");
  const router = useRouter();

  const handleOptionSelect = (option: string) => {
    setSelected(option);
    const stringUpdate = option.replace(" ", "-").toLowerCase();
    if (option === "Dashboard") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard/${stringUpdate}`);
    }
  };

  return (
    <main className="border-r w-1/6 ">
      <div className="h-16 border-b px-4 flex justify-center flex-col">
        <h2>TravelGenie</h2>
        <span>AI</span>
      </div>
      <p className="uppercase font-semibold text-[11px] px-7 pt-6 pb-3 text-gray-500">
        Workspace
      </p>
      <section className="px-4 flex flex-col gap-2">
        {SIDE_BAR_OPTIONS.map((option) => (
          <GradintWrapper
            selected={option.name === selected}
            key={option.name}
            option={option}
            onClick={() => handleOptionSelect(option.name)}
          />
        ))}
      </section>
    </main>
  );
};

export default Sidebar;
