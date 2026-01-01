"use client";

import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-[44px] w-full min-w-[180px] pl-4 pr-10 rounded-lg border border-[#e5e7eb] text-[#1f1e17] bg-white hover:border-[#4baf47] focus:border-[#4baf47] outline-none transition-all duration-200 cursor-pointer text-left flex items-center justify-between"
        style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown
          size={16}
          className={`absolute right-3 text-[#878680] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "8px 0",
            minWidth: "100%",
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                option.value === value
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-[#374151] hover:bg-[#F3F4F6] hover:text-[#374151] bg-white"
              }`}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                padding: "12px 16px",
                fontWeight: option.value === value ? 500 : 400,
              }}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check size={16} className="text-[#2563EB]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
