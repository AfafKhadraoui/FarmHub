'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Top Bar with Contact Info */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/images/img_logo.png" 
              alt="FarmHub Logo" 
              className="w-[150px] h-auto"
            />
          </Link>

          {/* Contact Info - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/images/img_vector.svg" alt="" className="w-6 h-6" />
              <div>
                <p className="text-xs text-gray-600">Call us</p>
                <p className="text-sm font-bold">+ 98 (000) - 9630</p>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="flex items-center gap-3">
              <img src="/images/img_icon.svg" alt="" className="w-6 h-6" />
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-bold">ambed@agrios.com</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <img src="/images/img_icon_green_500.svg" alt="" className="w-10 h-10" />
            <div>
              <p className="text-xs text-gray-600">Location</p>
              <p className="text-sm font-bold">Sidi Abdellah, Algiers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="w-full bg-white border-t border-gray-200">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8 flex-1">
              <Link href="/" className="font-bold text-gray-900 border-b-2 border-green-500 pb-1">
                Home
              </Link>
              <Link href="#about" className="font-semibold text-gray-600 hover:text-green-500">
                About
              </Link>
              <Link href="#services" className="font-semibold text-gray-600 hover:text-green-500">
                Services
              </Link>
              <Link href="#faq" className="font-semibold text-gray-600 hover:text-green-500">
                FAQ
              </Link>
              <Link href="#features" className="font-semibold text-gray-600 hover:text-green-500">
                Features
              </Link>
            </div>

            {/* Sign Up Button */}
            <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-lg">
              Sign up
            </Button>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden ml-4"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <Link href="/" className="font-bold text-gray-900">Home</Link>
                <Link href="#about" className="font-semibold text-gray-600">About</Link>
                <Link href="#services" className="font-semibold text-gray-600">Services</Link>
                <Link href="#faq" className="font-semibold text-gray-600">FAQ</Link>
                <Link href="#features" className="font-semibold text-gray-600">Features</Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
