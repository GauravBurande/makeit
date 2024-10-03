"use client";

import React, { useState, useId } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlainUser } from "@/helpers/types";
import { Loader, Expand, Download } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ImageCard from "./blocks/imageCard";
import { getImageDownloadUrl } from "@/app/actions";

interface ImageGalleryProps {
  user: PlainUser;
}

const ImageGallery = ({ user }: ImageGalleryProps) => {
  const [expandedImage, setExpandedImage] = useState<any>(null);
  const id = useId();

  const images = (user?.interiorImages || []).map(({ imageUrl, imageId }) => ({
    imageUrl,
    imageId,
  }));

  const handleDownload = async (objectName: string) => {
    try {
      const { url, error } = await getImageDownloadUrl(objectName);

      if (error) {
        throw new Error(error);
      }

      if (!url) {
        throw new Error("Download URL is missing");
      }

      // Fetch the image data
      const response = await fetch(url, {
        method: "GET",
        mode: "cors", // Ensure CORS mode is set
        credentials: "same-origin", // Or 'include' if the R2 bucket is on a different domain
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `image-${objectName.split("/").pop()}`; // Use the last part of the objectName as the filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <ScrollArea className="h-full">
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      {images?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {images.reverse().map((img, index) => (
            <motion.div
              key={img.imageId}
              layoutId={`card-${img.imageId}-${id}`}
              className="relative aspect-video bg-foreground/10 rounded-lg overflow-hidden group cursor-pointer"
            >
              {img.imageUrl === "" ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-accent">
                  <Loader className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-sm font-medium">Generating image...</p>
                  <p className="text-xs mt-1">This may take a few minutes</p>
                </div>
              ) : (
                <>
                  <motion.div layoutId={`image-${img.imageId}-${id}`}>
                    <Image
                      src={img.imageUrl}
                      alt={`Design ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="rounded-lg border"
                    />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setExpandedImage(img)}
                      className="p-2 bg-background/80 rounded-full shadow-md hover:bg-background transition-colors mr-2"
                    >
                      <Expand className="w-6 h-6 text-foreground/70" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(
                          img.imageUrl.replace("https://cdn.makeit.ai/", "")
                        );
                      }}
                      className="p-2 bg-background/80 rounded-full shadow-md hover:bg-background transition-colors"
                    >
                      <Download className="w-6 h-6 text-foreground/70" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
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
      <AnimatePresence>
        {expandedImage && (
          <ImageCard
            image={expandedImage}
            onClose={() => setExpandedImage(null)}
            id={id}
          />
        )}
      </AnimatePresence>
    </ScrollArea>
  );
};

export default ImageGallery;
