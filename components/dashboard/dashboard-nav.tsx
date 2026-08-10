"use client";

import { useAppSelector } from "@/redux/hooks";
import React from "react";

const DashboardNav = () => {
  const user = useAppSelector((state) => state.auth.user);

  console.log({user})

  return (
    <main className="px-5 py-2 flex justify-between items-center border h-16">
      <h4>Dashboard</h4>
      <div className="flex-1" >
        <div className="rounded-full flex w-3/5 px-2 items-center gap-3 border mx-auto">
          <input
            type="text"
            className="border-none py-2 outline-none"
            placeholder="Search trips, place, or ask AI..."
          />
        </div>
      </div>
      <section className="flex items-center gap-4">
        <div className="flex justify-center items-center gap-2 p-2 border rounded-full">
          <h4 className="font-semibold">{user?.credits}</h4>
          <span className="text-gray-500 text-xs">credits</span>
        </div>
        {user?.plan === "FREE" ? (
          <button className="bg-gradient-primary py-1 text-white px-4 rounded-2xl ">
            Upgrade
          </button>
        ) : null}
        <div className="border rounded-full">
          <span className="capitalize">{user?.name}</span>
        </div>
      </section>
    </main>
  );
};

export default DashboardNav;
