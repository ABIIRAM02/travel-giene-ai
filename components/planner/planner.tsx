
import React from 'react'
import PlannerForm from './planner-form'

const Planner = () => {
  return (
    <main className='flex flex-col items-center h-full' >
      <section className='w-10/12 bg-card rounded-3xl shadow-elevated border p-10' >
        <span className='uppercase font-semibold text-xs text-primary tracking-widest' >ai  trip  planner</span>
        <div className='flex flex-col gap-1 my-3' >
          <h2 className='text-3xl font-medium'>Design your perfect trip</h2>
          <p className='text-gray-500' >Tell TravelGenie where you dream of going. We'll do the rest.</p>
        </div>
        <PlannerForm />
      </section>
    </main>
  )
}

export default Planner