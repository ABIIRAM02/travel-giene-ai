import React from "react";
import GradintWrapper from "../ui/gradient-wrapper";

const Dashboard = () => {

  const option = {
    icon: 'L',
    name: 'Plan a new trip'
  }

  return (
    <main className="flex justify-between items-end  border-red-600" >
      <div className="flex flex-col gap-1" >
        <h2 className="text-3xl font-medium" >Good morning, Ananya ✦</h2>
        <p className="text-gray-500" >You have 3 upcoming trips and 2,430 AI credits ready to spend.</p>
      </div>
      <GradintWrapper classname="text-base" option={option} />
    </main>
  );
};

export default Dashboard;
