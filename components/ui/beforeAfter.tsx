"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect, useCallback } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      event.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (isDragging && containerRef.current) {
        event.preventDefault();
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const clientX =
          "touches" in event ? event.touches[0].clientX : event.clientX;
        const mouseX = clientX - containerRect.left;
        const newPosition = (mouseX / containerWidth) * 100;
        setSliderPosition(Math.max(0, Math.min(100, newPosition)));
      }
    },
    [isDragging]
  );

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <Image
        src={afterImage}
        alt="Before"
        width={512}
        height={512}
        className="absolute top-0 left-0 w-full h-full rounded-xl object-cover pointer-events-none"
      />
      <div
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        className="absolute top-0 left-0 w-full h-full"
      >
        <Image
          src={beforeImage}
          alt="After"
          width={512}
          height={512}
          className="w-full h-full rounded-xl object-cover pointer-events-none"
        />
      </div>
      <div
        style={{ left: `${sliderPosition}%` }}
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
            <polyline points="9 18 3 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
