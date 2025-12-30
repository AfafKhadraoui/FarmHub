'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
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
                <p className="text-sm font-bold">support@farmhub.com</p>
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
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`font-semibold transition-colors ${
                    link.href === '/' 
                      ? 'text-gray-900 border-b-2 border-green-500 pb-1' 
                      : 'text-gray-600 hover:text-green-500'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link 
                href="/login"
                className="hidden sm:inline-flex text-gray-900 px-6 py-3 rounded-lg font-semibold text-sm hover:text-green-500 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="bg-[#4baf47] text-white px-8 py-4 rounded-lg font-bold text-sm hover:bg-[#3d9a39] transition-colors inline-flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden ml-4"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-semibold text-gray-600 hover:text-green-500 py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="border-t border-gray-200 pt-4 flex flex-col gap-2">
                  <Link 
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-900 px-6 py-3 rounded-lg font-semibold text-sm hover:text-green-500 text-center"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="bg-[#4baf47] text-white px-8 py-4 rounded-lg font-bold text-sm hover:bg-[#3d9a39] text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}