'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Users, Leaf } from 'lucide-react'; 

export default function WhoUsesFarmHub() {
    return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-2xl text-[#eec044] mb-2 font-covered">
            Our users
          </h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-[#1f1e17] mb-6">
            Who Uses FarmHub?
          </h3>
          <p className="text-xl text-[#878680] leading-relaxed max-w-4xl">
            Farm owners get complete control with field management, task creation, worker coordination, and analytics. Workers get a simplified dashboard showing their assigned tasks, field information, and easy status updates. Both roles work together seamlessly through our platform.
          </p>
        </div>

        {/* User Types Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Farm Owners Card */}
          <div className="bg-[#4baf47] text-white rounded-2xl p-8 shadow-xl">
            <Users className="w-16 h-16 mb-4" />
            <h4 className="text-3xl font-bold mb-4">Farm Owners</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Complete field management and crop tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Create and assign tasks to multiple workers</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Monitor team performance and analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Generate farm access codes instantly</span>
              </li>
            </ul>
          </div>

          {/* Workers Card */}
          <div className="bg-[#1f1e17] text-white rounded-2xl p-8 shadow-xl">
            <Leaf className="w-16 h-16 mb-4" />
            <h4 className="text-3xl font-bold mb-4">Farm Workers</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>View assigned tasks and priorities</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Update task status in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Access field information and history</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Easy onboarding with farm code</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );

}
