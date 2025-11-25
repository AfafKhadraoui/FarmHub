'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export default function Testimonials() {
    return (
    <section className="w-full py-20 bg-[#f8f7f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-[#eec044] mb-4 font-covered">
            Testimonials
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center max-w-5xl mx-auto">
          {/* Customer Image */}
          <div className="flex-shrink-0">
            <img 
              src="/images/3.jpg.png" 
              alt="Ahmed K." 
              className="w-64 h-64 object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Testimonial Content */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-[#f3b839]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <blockquote className="text-2xl text-[#878680] leading-relaxed mb-6">
              "FarmHub transformed how we manage our 200-acre farm. Task assignments are clear, workers know exactly what to do, and I can track everything from my phone. The field history feature is invaluable for crop rotation planning."
            </blockquote>
            
            <div className="border-t-2 border-[#878680] pt-6">
              <div className="font-bold text-xl text-[#1f1e17]">
                Ahmed K., Farm Owner
              </div>
              <div className="text-[#4baf47] font-medium uppercase text-sm">
                Green Valley Farms
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
