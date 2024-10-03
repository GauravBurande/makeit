import React, { useState, useEffect, useRef } from "react";
import { X, Maximize2 } from "lucide-react";
import BeforeAfterSlider from "@/components/ui/beforeAfter";
import { getImageInfo } from "@/app/actions";
import { IInteriorImage } from "@/models/InteriorImage";
import { motion, AnimatePresence } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";

interface ImageCardProps {
  image: {
    imageUrl: string;
    imageId: string;
  };
  onClose: () => void;
  id: string;
}

const ImageCard = ({ image, onClose, id }: ImageCardProps) => {
  const [imageInfo, setImageInfo] = useState<IInteriorImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchImageInfo = async () => {
      try {
        const info = await getImageInfo(image.imageId);
        setImageInfo(info as IInteriorImage);
      } catch (error) {
        console.error("Error fetching image info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageInfo();
  }, [image.imageId]);

  useOutsideClick(cardRef, onClose);

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  const InfoItem = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
      <div className="mb-2">
        <strong>{label}:</strong> {value}
      </div>
    );
  };

  return (
    <motion.div
      layoutId={`card-${image.imageId}-${id}`}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <motion.div
        ref={cardRef}
        className="bg-background rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <div className="flex justify-end mb-4">
          <motion.button
            onClick={onClose}
            className="p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground/90"></div>
          </div>
        ) : (
          <>
            <motion.div
              layoutId={`image-${image.imageId}-${id}`}
              className="relative mb-6"
            >
              <BeforeAfterSlider
                beforeImage={imageInfo?.beforeImage || ""}
                afterImage={image.imageUrl}
              />
              <motion.button
                className="absolute bottom-2 right-2 p-2 bg-background/80 rounded-full shadow-md hover:bg-background transition-colors"
                onClick={toggleFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Maximize2 className="w-6 h-6 text-foreground/70" />
              </motion.button>
            </motion.div>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4">Image Details</h3>
              <div className="space-y-2">
                <InfoItem label="Prompt" value={imageInfo?.prompt} />
                <InfoItem
                  label="Negative Prompt"
                  value={imageInfo?.negativePrompt}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Style" value={imageInfo?.style} />
                <InfoItem label="Room Type" value={imageInfo?.roomType} />
                <InfoItem label="Color" value={imageInfo?.color} />
                <InfoItem label="Material" value={imageInfo?.material} />
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/90 flex items-center justify-center z-[60]"
            onClick={toggleFullscreen}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full h-full"
            >
              <Image
                src={image.imageUrl}
                alt="Fullscreen view"
                layout="fill"
                objectFit="contain"
              />
              <motion.button
                className="absolute top-4 right-4 p-2 bg-background/80 rounded-full shadow-md hover:bg-background transition-colors"
                onClick={toggleFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6 text-foreground/70" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageCard;
