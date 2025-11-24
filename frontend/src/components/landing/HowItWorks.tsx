'use client';

import React from 'react';

const steps = [
  {
    id: 1,
    title: 'Create Your Farm',
    image: '/images/img__2.png',
    icon: '/images/farm-svgrepo-com.svg'
  },
  {
    id: 2,
    title: 'Add Your Team',
    image: '/images/img__3.png',
    icon: '/images/team-svgrepo-com.svg'
  },
  {
    id: 3,
    title: 'Start Managing',
    image: '/images/img__4.png',
    icon: '/images/manage-svgrepo-com.svg'
  }
];

export default function HowItWorks() {
  return (
    <section id="features" className="w-full py-20 bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-['Covered_By_Your_Grace'] text-[#eec044] mb-2">
            Get Started with us
          </h2>
          <h3 className="text-5xl font-extrabold text-gray-900">
            How FarmHub Works
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="relative">
              <div 
                className="h-96 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${step.image})` }}
              >
                <div className="absolute bottom-0 right-0 flex items-center gap-4 bg-white rounded-tl-lg p-6 shadow-lg">
                  <img src={step.icon} alt="" className="w-10 h-10" />
                  <h4 className="text-xl font-bold">{step.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
