// src/components/auth/AuthPanelLeft.tsx

import React from 'react';

export function AuthPanelLeft({ mode }: { mode: 'login' | 'register' }) {
  return (
    <div
      className="hidden lg:flex min-h-screen lg:flex-col lg:justify-center lg:w-2/5 relative overflow-hidden text-white"
      style={{
        backgroundImage: "url('/images/farm.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Green overlay to blend image with brand color */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5cb85c]/90 to-[#4ca74c]/85 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 p-12">
        <h1 className="text-4xl font-bold mb-4 text-white">
          {mode === 'login'
            ? 'Welcome Back to FarmHub'
            : 'Join FarmHub today'}
        </h1>
        <p className="text-lg mb-8 opacity-90 text-white">
          manage your farm operations with your team , track fields and grow efficiently .
        </p>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              {/* Field & Crop Icon (Map) */}
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Field & Crop Tracking</h3>
              <p className="text-sm opacity-90 text-white">Monitor your fields and crop cycles</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              {/* Task Management Icon (Clipboard) */}
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Task Management</h3>
              <p className="text-sm opacity-90 text-white">Assign and track farm tasks</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              {/* Team Collaboration Icon (Users) */}
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Team Collaboration</h3>
              <p className="text-sm opacity-90 text-white">Work together seamlessly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
