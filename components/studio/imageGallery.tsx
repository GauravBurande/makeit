"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlainUser } from "@/helpers/types";
import { Loader, Expand, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ImageCard from "./blocks/imageCard";
import { Button } from "../ui/button";
import { GetMoreImages } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface ImageGalleryProps {
  user: PlainUser;
}

const ImageGallery = ({ user }: ImageGalleryProps) => {
  const { toast } = useToast();

  const initialImages = (user?.interiorImages || [])
    .reverse()
    .map(({ imageUrl, imageId }) => ({
      imageUrl,
      imageId,
    }));
  const [images, setimages] = useState(initialImages);
  const [expandedImage, setExpandedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const LoadMoreImages = async () => {
    try {
      setLoading(true);
      const sliceValue = images.length + 12;
      const nextImages = await GetMoreImages(sliceValue);
      if (!nextImages) return;
      const existingImageIds = new Set(images.map((img) => img.imageId));
      const actuallyNewImages = nextImages.filter(
        (img) => !existingImageIds.has(img.imageId)
      );

      if (actuallyNewImages.length === 0) {
        toast({
          variant: "destructive",
          title: "No new images",
          description: "All images have already been loaded.",
        });
        setDisabled(true);
        return;
      }
      const newImages = Array.from(
        new Map(
          [...images, ...nextImages].map((img) => [img.imageId, img])
        ).values()
      );

      setimages(newImages);
    } catch (error) {
      console.error("Error fetching more images:", error);
    } finally {
      setLoading(false);
    }
  };

  // todo: fix download when live on makeit.ai domain
  // const handleDownload = (imageUrl: string, imageName: string) => async () => {
  //   const link = document.createElement("a");

  //   try {
  //     link.href = imageUrl;
  //     link.download = imageName;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {images.map((img, index) => (
              <motion.div
                key={img.imageId}
                layoutId={`card-${img.imageId}}`}
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
                    <motion.div layoutId={`image-${img.imageId}`}>
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
                      {/* <button
                      onClick={handleDownload(
                        img.imageUrl,
                        img.imageUrl.split("/").pop() || ""
                      )}
                      className="p-2 bg-background/80 rounded-full shadow-md hover:bg-background transition-colors"
                    >
                      <Download className="w-6 h-6 text-foreground/70" />
                    </button> */}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
          {images?.length > 11 && (
            <Button
              onClick={LoadMoreImages}
              disabled={loading || disabled}
              className="flex items-center gap-4 uppercase w-[97%] mx-auto my-4"
            >
              {loading ? (
                <>
                  <Loader className="w-8 h-8 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  Load More Images
                </>
              )}
            </Button>
          )}
        </>
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
          />
        )}
      </AnimatePresence>
    </ScrollArea>
  );
};

export default ImageGallery;
