'use client';

import React from 'react';
import Link from "next/link"
import { Button } from '@/components/ui/button';

export default function CTA() {
  return (
    <section className="w-full bg-gradient-to-r from-green-600 to-green-700 py-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Farm Management?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of farmers who are already using FarmHub to streamline their operations
        </p>
        <Link href="/register">
          <Button className="bg-white text-green-600 hover:bg-gray-100 px-12 py-6 text-lg font-bold">
             Get Started Free
          </Button>
        </Link>
      </div>
    </section>
  );
}