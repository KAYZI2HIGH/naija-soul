"use client";

import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, ChevronLeft, Mic, Search, User, Utensils } from "lucide-react";
import { useState, useRef } from "react";
import { AI_Prompt } from "@/components/animated-ai-input";

export default function LandingPage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Features with icons (emoji-based for cleaner appearance)
  const features = [
    { icon: "🍽️", label: "Reviews" },
    { icon: "🔊", label: "Audio" },
    { icon: "⭐", label: "Ratings" },
    { icon: "🎯", label: "Smart Recs" },
    { icon: "🌡️", label: "Context" },
    { icon: "🎤", label: "Voice AI" },
    { icon: "📍", label: "Local" },
  ];

  // Languages with icons
  const languages = [
    { icon: "🇬🇧", label: "English" },
    { icon: "🇳🇬", label: "Pidgin" },
    { icon: "🗣️", label: "Yoruba" },
    { icon: "🗣️", label: "Igbo" },
    { icon: "🗣️", label: "Hausa" },
  ];

  const scroll = (direction: "left" | "right") => {
    if (toolbarRef.current) {
      const scrollAmount = 200;
      const newPosition =
        direction === "left" ?
          Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

      toolbarRef.current.scrollLeft = newPosition;
      setScrollPosition(newPosition);
    }
  };

  return (
    <div
      className="relative h-screen w-screen overflow-y-auto overflow-x-hidden bg-cover bg-bottom bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop')",
      }}
    >
      {/* Premium gradient overlay for text readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-900/40 via-blue-900/35 to-black/70" />

      {/* Main content container - fits exactly in h-screen */}
      <div className="relative z-10 h-screen w-full flex flex-col">
        {/* ============ HEADER ============ */}
        <header className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
              🇳🇬 NAIJA SOUL
            </span>
          </div>

          {/* Navigation - Hidden on mobile, visible on sm and up */}
          <nav className="hidden sm:flex items-center gap-4 md:gap-8 text-sm">
            <a
              href="#features"
              className="text-gray-200 hover:text-white transition"
            >
              Features
            </a>
            <a
              href="#how"
              className="text-gray-200 hover:text-white transition"
            >
              How It Works
            </a>
            <a
              href="#demo"
              className="text-gray-200 hover:text-white transition"
            >
              Demo
            </a>
          </nav>

          {/* CTA Button */}
          <button className="px-3 sm:px-4 py-1.5 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition text-xs sm:text-sm md:text-base whitespace-nowrap">
            Try Now
          </button>
        </header>

        {/* ============ HERO SECTION ============ */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Badge */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 bg-cyan-100/90 backdrop-blur-sm text-cyan-900 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-medium shadow-lg">
              <span>🔊</span>
              <span>POWERED BY YARNGPT - AUTHENTIC NIGERIAN VOICES</span>
              <span>→</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Main Headline */}
            <h1 className="flex-shrink-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center max-w-5xl leading-tight md:leading-tight lg:leading-tight">
              Think It. Say It. Taste It.
            </h1>

            {/* Subheadline */}
            <p className="flex-shrink-0 text-sm sm:text-base md:text-lg text-gray-100 text-center max-w-3xl leading-relaxed">
              Restaurant recommendations that actually{" "}
              <span className="underline decoration-cyan-300 decoration-2 underline-offset-2">
                sound like you.
              </span>
            </p>
          </div>

          <div className="flex-shrink-0 w-full max-w-xl sm:max-w-2xl hidden">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 backdrop-blur-sm">
              {/* User ID Input */}
              <div className="flex gap-3 items-center w-full">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your user ID (e.g., 12345)"
                  className="flex-1 w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm sm:text-base font-medium"
                />
              </div>

              {/* Divider */}
              <div className="flex gap-2 items-center w-full">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">
                  Select a Restaurant
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Restaurant Select */}
              <div className="flex gap-3 items-center w-full">
                <span className="text-sm flex-shrink-0">
                  <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                </span>
                <Select
                  value={selectedRestaurant}
                  onValueChange={setSelectedRestaurant}
                >
                  <SelectTrigger className="flex-1 w-full bg-transparent outline-none text-gray-900 text-sm font-medium border-0 ring-0 shadow-none hover:bg-transparent focus:ring-0 p-0">
                    <SelectValue placeholder="Wetin you wan chop today?" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl">
                    <SelectItem
                      value="nigerian"
                      className="text-gray-800 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      🍲 Nigerian Cuisine
                    </SelectItem>
                    <SelectItem
                      value="jollof"
                      className="text-gray-800 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      🍚 Jollof Rice Spots
                    </SelectItem>
                    <SelectItem
                      value="suya"
                      className="text-gray-800 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      🥩 Suya & Grills
                    </SelectItem>
                    <SelectItem
                      value="seafood"
                      className="text-gray-800 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      🦞 Seafood Restaurants
                    </SelectItem>
                    <SelectItem
                      value="fast-food"
                      className="text-gray-800 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      🍔 Fast Food
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <AI_Prompt/>

          {/* Icon Toolbar */}
          <div className="flex-shrink-0 w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl flex backdrop-blur-2xl rounded-xl shadow-2xl  gap-4 sm:gap-6 md:gap-8 hidden">
            {/* Features Section */}
            <div className="mb-4 border-r border-gray-700 p-4 pr-4 sm:pr-6 lg:pr-8">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-200 mb-2 sm:mb-3 px-2">
                Features
              </h3>
              <div className="flex items-center gap-2 sm:gap-3 px-2">
                <div
                  ref={toolbarRef}
                  className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide flex-1"
                >
                  {features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-lg sm:text-2xl md:text-3xl group-hover:scale-110 transition"
                    >
                      {feature.icon}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Languages Section */}
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-200 mb-2 sm:mb-3 px-2">
                Languages
              </h3>
              <div className="flex items-center gap-2 sm:gap-3 px-2">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide flex-1">
                  {languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="text-lg sm:text-2xl md:text-3xl group-hover:scale-110 transition"
                    >
                      {lang.icon}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Scrollbar hide style */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
