'use client';

import React from 'react';
import FeatureCard from './FeatureCard';

const features = [
  {
    id: 1,
    title: 'Field Management',
    description: 'Track your farm plots with complete crop history and rotation planning',
    image: '/images/img_service_05_webp.png',
    icon: '/images/img_icon_white_a700_50x50.svg'
  },
  {
    id: 2,
    title: 'Task Management',
    description: 'Assign tasks to multiple workers and track completion in real-time',
    image: '/images/tablet.png',
    icon: '/images/img_vector_white_a700.svg'
  },
  {
    id: 3,
    title: 'Weather Integration',
    description: 'Get real-time weather forecasts to plan your farming activities better',
    image: '/images/img_service_07_webp.png',
    icon: '/images/img_icon_50x50.svg'
  }
];

export default function Features() {
  return (
    <section id="services" className="w-full bg-[#f8f7f0] py-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-['Covered_By_Your_Grace'] text-[#eec044] mb-2">
            Our Services
          </h2>
          <h3 className="text-5xl font-extrabold text-gray-900">
            What We Offer
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
