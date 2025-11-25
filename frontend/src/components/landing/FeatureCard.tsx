"use client"

import Image from "next/image"

interface FeatureCardProps {
  id: number
  title: string
  description: string
  image?: string
  onMouseEnter?: () => void
}

export default function FeatureCard({ id, title, description, image, onMouseEnter }: FeatureCardProps) {
  return (
    <div
      className="flex flex-col justify-between items-center bg-white rounded-[26px] shadow-[0px_4px_9px_#0000003f]
      p-4 md:p-6 w-full max-w-[350px] h-full"
      onMouseEnter={onMouseEnter}
    >
      <p className="text-[22px] sm:text-[24px] md:text-[26px] font-normal leading-[30px] sm:leading-[33px] md:leading-[36px] text-center text-[#eec044] font-covered mt-3">
        Feature 0{id}
      </p>

      <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold leading-[28px] sm:leading-[30px] md:leading-[33px] text-center text-[#1f1e17] font-sans mt-2">
        {title}
      </h3>

      <p className="text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[26px] sm:leading-[28px] md:leading-[30px] text-left text-[#878680] font-sans mt-5 px-2 w-full">
        {description}
      </p>

      {image && (
        <Image
          src={image}
          alt={title}
          width={400}
          height={266}
          className="w-full h-[200px] md:h-[230px] object-contain rounded-lg mt-3 mb-2"
        />
      )}

    </div>
  )
}