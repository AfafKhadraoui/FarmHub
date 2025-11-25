'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative w-full bg-[#1f1e17] py-20 lg:py-32" 
      style={{ backgroundImage: 'url(/images/img_divelementorrepeateritem5887cc6.png)', backgroundSize: 'cover' }}>
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-4xl">
          <h1 className="text-6xl lg:text-8xl font-covered text-white leading-tight mb-8">
            Farm Management Made Simple
          </h1>
          
          <p className="text-lg text-white/70 max-w-2xl mb-8">
            Coordinate with your team, track fields, and manage your farm operations all in one place
          </p>

          <div className="flex items-center gap-6">
            <a 
                href="/register"
                className="bg-[#4baf47] text-white px-8 py-4 rounded-lg font-bold text-sm hover:bg-[#3d9a39] transition-colors inline-flex items-center justify-center"
              >
                Get Started
            </a>
            <img src="/images/img_elements.png" alt="" className="w-28 h-14" />
          </div>
        </div>
      </div>
    </section>
  );
}