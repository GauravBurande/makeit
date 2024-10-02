"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlainUser } from "@/helpers/types";
import { Loader, Expand } from "lucide-react";
import ImageCard from "./blocks/imageCard";

interface ImageGalleryProps {
  user: PlainUser;
}

const ImageGallery = ({ user }: ImageGalleryProps) => {
  const [expandedImage, setExpandedImage] = useState<any>(null);

  const images = (user?.interiorImages || []).map(({ imageUrl, imageId }) => ({
    imageUrl,
    imageId,
  }));

  return (
    <ScrollArea className="h-full">
      {images?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {images.reverse().map((img, index) => (
            <div
              key={index}
              className="relative aspect-video bg-foreground/10 rounded-lg overflow-hidden group"
            >
              {img.imageUrl === "" ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-accent">
                  <Loader className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-sm font-medium">Generating image...</p>
                  <p className="text-xs mt-1">This may take a few minutes</p>
                </div>
              ) : (
                <>
                  <Image
                    src={img.imageUrl}
                    alt={`Design ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="rounded-lg border"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setExpandedImage(img)}
                      className="p-2 bg-background/80 rounded-full shadow-md hover:bg-background transition-colors"
                    >
                      <Expand className="w-6 h-6 text-foreground/70" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full pb-10 md:min-h-[calc(100vh-80px)] flex flex-col gap-2 justify-center items-center">
          <p className="text-lg">No interior images created by you yet!</p>
          <p className="text-accent">
            Start creating interior images right now!
          </p>
        </div>
      )}
      {expandedImage && (
        <ImageCard
          image={expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      )}
    </ScrollArea>
  );
};

export default ImageGallery;
