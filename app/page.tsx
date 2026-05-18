"use client";

import { ChevronRight, ChevronLeft, Mic, Search } from "lucide-react";
import { useState, useRef } from "react";

export default function LandingPage() {
  const [scrollPosition, setScrollPosition] = useState(0);
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
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop')",
      }}
    >
      {/* Premium gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-900/35 to-black/70" />

      {/* Main content container - fits exactly in h-screen */}
      <div className="relative z-10 h-full w-full flex flex-col">
        {/* ============ HEADER ============ */}
        <header className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center border-b border-white/5 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
              🇳🇬 NAIJA SOUL
            </span>
          </div>

          {/* Navigation - Hidden on mobile, visible on sm and up */}
          <nav className="hidden sm:flex items-center gap-4 md:gap-8 text-sm md:text-base">
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
          <button className="px-3 sm:px-4 py-2 sm:py-2.5 md:py-2 lg:py-2.5 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition text-xs sm:text-sm md:text-base whitespace-nowrap">
            Try Now
          </button>
        </header>

        {/* ============ HERO SECTION ============ */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 space-y-3 sm:space-y-4 lg:space-y-6 overflow-hidden">
          {/* Badge */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 bg-cyan-100/90 backdrop-blur-sm text-cyan-900 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm md:text-base font-medium shadow-lg">
              <span>🔊</span>
              <span>POWERED BY YARNGPT - AUTHENTIC NIGERIAN VOICES</span>
              <span>→</span>
            </div>
          </div>

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

          {/* Search Input Box */}
          <div className="flex-shrink-0 w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 md:p-5 lg:p-6 flex items-center gap-2 sm:gap-3 md:gap-4 backdrop-blur-sm">
              {/* Edit Icon */}
              <div className="flex-shrink-0 text-gray-400">
                <svg
                  className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>

              {/* Input Field */}
              <input
                type="text"
                placeholder="Wetin you wan chop today?"
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm sm:text-base md:text-lg font-medium"
              />

              {/* Voice Input Button */}
              <button className="flex-shrink-0 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition font-medium text-xs sm:text-sm md:text-base shadow-md">
                <Mic className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
                <span className="hidden sm:inline">Voice</span>
              </button>

              {/* Search Button */}
              <button className="flex-shrink-0 flex items-center justify-center p-1.5 sm:p-2 md:p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md">
                <Search className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7" />
              </button>
            </div>
          </div>

          {/* Icon Toolbar - Scrollable */}
          <div className="flex-shrink-0 w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
            {/* Features Section */}
            <div className="mb-4">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-200 mb-2 sm:mb-3 px-2">
                Features
              </h3>
              <div className="flex items-center gap-2 sm:gap-3 px-2">
                <button
                  onClick={() => scroll("left")}
                  className="flex-shrink-0 p-1 sm:p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
                >
                  <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>

                <div
                  ref={toolbarRef}
                  className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide flex-1"
                >
                  {features.map((feature, idx) => (
                    <button
                      key={idx}
                      className="flex-shrink-0 flex flex-col items-center gap-1 p-2 sm:p-3 md:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition group"
                    >
                      <span className="text-lg sm:text-2xl md:text-3xl group-hover:scale-110 transition">
                        {feature.icon}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-200 whitespace-nowrap">
                        {feature.label}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => scroll("right")}
                  className="flex-shrink-0 p-1 sm:p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
                >
                  <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Languages Section */}
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-200 mb-2 sm:mb-3 px-2">
                Languages
              </h3>
              <div className="flex items-center gap-2 sm:gap-3 px-2">
                <button
                  onClick={() => scroll("left")}
                  className="flex-shrink-0 p-1 sm:p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
                >
                  <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>

                <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide flex-1">
                  {languages.map((lang, idx) => (
                    <button
                      key={idx}
                      className="flex-shrink-0 flex flex-col items-center gap-1 p-2 sm:p-3 md:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition group"
                    >
                      <span className="text-lg sm:text-2xl md:text-3xl group-hover:scale-110 transition">
                        {lang.icon}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-200 whitespace-nowrap">
                        {lang.label}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => scroll("right")}
                  className="flex-shrink-0 p-1 sm:p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
                >
                  <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
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
