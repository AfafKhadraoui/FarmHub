'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';


export default function PlatformBenefits() {
    const benefits = [
        'Improve worker coordination',
        'Increase productivity with task tracking',
        'Monitor field changes over time',
        'Centralize all farm information in one place',
        'Simple and intuitive dashboard for farm owners',
    ];

    return (
        <section className="w-full py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-[#eec044] text-2xl mb-2 font-covered">
                        Our Platform Benefits
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1f1e17]">
                        Why Use Our Platform
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left Image */}
                    <div className="flex-1">
                        <img
                            src="/images/dashbord.png"
                            alt="Platform Benefits"
                            className="w-full h-auto rounded-[50px] shadow-2xl"
                        />
                    </div>

                    {/* Right Benefits List */}
                    <div className="flex-1">
                        <div className="space-y-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#4baf47] flex items-center justify-center flex-shrink-0 mt-1">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-xl text-[#878680] font-semibold">
                                        {benefit}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
