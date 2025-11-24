'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#24231d] text-white">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <img 
              src="/images/img_logo_footer.png" 
              alt="FarmHub Logo" 
              className="w-[170px] h-auto"
            />
            <p className="text-base text-gray-400">
              From field management to team collaboration, FarmHub provides everything you need to run your farm operations smoothly. Track crops, assign tasks, and keep your entire team connected.
            </p>
          </div>

          {/* Explore Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Explore</h3>
            <div className="w-12 h-1 bg-green-500" />
            <nav className="space-y-3 mt-4">
              {['About', 'Services', 'FAQ', 'Features', 'Testimonials', 'Work'].map((item) => (
                <Link 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="flex items-center gap-2 text-gray-400 hover:text-green-500"
                >
                  <span className="text-green-500">›</span>
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact</h3>
            <div className="w-12 h-1 bg-green-500" />
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-orange-400">📞</span>
                <span>666 888 0000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-orange-400">✉️</span>
                <span>needhelp@company.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-orange-400">📍</span>
                <span>Sidi Abdellah, Algiers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © All Copyright 2025 by Software Engineering Team
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-white">
                Terms of Use
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

