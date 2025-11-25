"use client"

import { useState } from "react"
import Image from "next/image"
import FeatureCard from "./FeatureCard"

interface Feature {
  id: number
  title: string
  description: string
  image: string
}

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<number>(0)

  const features: Feature[] = [
  {
    id: 1,
    title: "Field Management",
    description: "Easily map, organize, and monitor your fields and crops.",
    image: "/images/20251117_1813_Minimal Field Map_simple_compose_01ka9cvjmzf25atgs72x5qpkv1.png",
  },
  {
    id: 2,
    title: "Smart Task Management",
    description: "Create, assign, and track farm tasks with real-time updates.",
    image: "/images/20251117_1815_Task Assignment Icon_simple_compose_01ka9cxmxxeg896qd9y2q823f4.png",
  },
  {
    id: 3,
    title: "Dashboard & Insights",
    description: "View farm statistics, worker performance, and progress insights.",
    image: "/images/20251117_1815_Green Dashboard Sketch_simple_compose_01ka9czny0eewb8jrt3pa0pg49.png",
  },
  {
    id: 4,
    title: "Weather Monitoring",
    description: "Get real-time forecasts and alerts for better farming decisions.",
    image: "/images/20251117_1817_Sun and Cloud Sketch_simple_compose_01ka9d3qzrfdes4f5v70tv65yy.png",
  },
]

  return (
    <section id="features" className="w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-[49px] sm:gap-[74px] md:gap-[98px] justify-start items-center w-full py-[47px] sm:py-[71px] md:py-[94px]">

          {/* Section Header */}
          <div className="flex flex-col justify-start items-center w-auto">
            <p className="text-[20px] sm:text-[22px] md:text-[24px] font-normal text-center text-[#eec044] font-covered">
              Our Features
            </p>
            <h2 className="text-[36px] sm:text-[42px] md:text-[48px] font-extrabold text-center text-[#1f1e17] font-sans mt-[26px]">
              Why Choose Us ?
            </h2>
            <p className="text-[20px] sm:text-[23px] md:text-[26px] font-extrabold text-center text-[#4baf47] font-sans mt-[10px]">
              Everything you need to manage your farm efficiently
            </p>
          </div>

          {/* Features Grid */}
          <div className="relative w-full lg:w-[96%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-stretch w-full">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.id}
                  id={feature.id}
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                  onMouseEnter={() => setActiveFeature(index)}
                />
              ))}
            </div>

            {/* Feature Image Overlays */}
            <div className="hidden lg:block absolute left-[31%] top-[70px] z-[-1] pointer-events-none">
              <Image
                src="/images/img_20251117_1815_task.png"
                alt="Task Management"
                width={250}
                height={376}
                className="w-[250px] h-auto"
              />
            </div>

            <div className="hidden lg:block absolute right-[4%] top-[50px] z-[-1] pointer-events-none">
              <Image
                src="/images/img_20251117_1817_sun.png"
                alt="Weather Monitoring"
                width={282}
                height={424}
                className="w-[282px] h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
