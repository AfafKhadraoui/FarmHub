'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Play } from 'lucide-react';

export default function GetToKnowUs() {
    return (
        <section className="w-full py-20 bg-[#f8f7f0] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left Content */}
                    <div className="flex-1">
                        <h2 className="text-2xl text-[#eec044] mb-2 font-covered">
                            Get to know us
                        </h2>
                        <h3 className="text-4xl lg:text-5xl font-extrabold text-[#1f1e17] mb-6">
                            Modern Farm Management Platform
                        </h3>

                        <p className="text-[#878680] text-lg leading-relaxed mb-8">
                            FarmHub connects farm owners with their workers, enabling efficient field tracking, task management, and team collaboration. Whether you are managing crops or coordinating harvest schedules, FarmHub streamlines your operations.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-2xl text-[#4baf47] mb-4 font-covered">
                                    Key Features We Offer
                                </h4>
                                <ul className="space-y-3 text-[#878680]">
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-[#4baf47] mt-1 flex-shrink-0" />
                                        <span>Field & Crop History Tracking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-[#4baf47] mt-1 flex-shrink-0" />
                                        <span>Task Assignment & Management</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-[#4baf47] mt-1 flex-shrink-0" />
                                        <span>Real-time Weather Updates</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-[#4baf47] mt-1 flex-shrink-0" />
                                        <span>Team Collaboration Tools</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                     {/* Right Section Updated */}
                    <div className="flex-1 flex justify-center relative">
                        {/* Container for whole right side */}
                        <div className="relative flex gap-4">

                            {/* Left column (small image + badge) */}
                            <div className="flex flex-col items-center">
                                {/* Smaller Image */}
                                <img
                                    src="/images/image-01-1.webp.png"
                                    alt="Farm worker"
                                    className="w-56 h-70 object-cover rounded-lg shadow-lg"
                                />

                                {/* 24/7 Badge under image */}
                                <div className="mt-4 text-center">
                                    <div className="text-5xl font-normal text-[#4baf47] font-covered">
                                        24/7
                                    </div>
                                    <p className="text-sm font-medium text-[#4baf47]">Support Available</p>
                                </div>
                            </div>

                            {/* Right big image */}
                            <img
                                src="/images/image-02-1.webp.png"
                                alt="Farm landscape"
                                className="w-64 h-[calc(20rem+4rem)] object-cover rounded-lg shadow-lg"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}