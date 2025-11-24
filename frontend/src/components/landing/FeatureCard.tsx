'use client';

import React from 'react';

interface FeatureCardProps {
  feature: {
    title: string;
    description: string;
    image: string;
    icon: string;
  };
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      <img 
        src={feature.image} 
        alt={feature.title} 
        className="w-full h-64 object-cover"
      />
      <div className="relative p-6">
        <div className="absolute -top-8 right-6 bg-[#c5ce38] rounded-lg p-4">
          <img src={feature.icon} alt="" className="w-12 h-12" />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-3 mt-4">
          {feature.title}
        </h4>
        <p className="text-base text-gray-600">
          {feature.description}
        </p>
      </div>
    </div>
  );
}