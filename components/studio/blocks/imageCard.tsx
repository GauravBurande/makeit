import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import BeforeAfterSlider from "@/components/ui/beforeAfter";
import { getImageInfo } from "@/app/actions";
import { IInteriorImage } from "@/models/InteriorImage";

interface ImageCardProps {
  image: {
    imageUrl: string;
    imageId: string;
  };
  onClose: () => void;
}

// todo: fix this shit

const ImageCard = ({ image, onClose }: ImageCardProps) => {
  const [imageInfo, setImageInfo] = useState<IInteriorImage | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="fixed inset-0 bg-foreground bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-foreground rounded-lg p-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1">
            <X className="w-6 h-6" />
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground/90"></div>
          </div>
        ) : (
          <>
            <BeforeAfterSlider
              beforeImage={imageInfo?.beforeImage || ""}
              afterImage={image.imageUrl}
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Image Details</h3>
              <p>
                <strong>Prompt:</strong> {imageInfo?.prompt}
              </p>
              <p>
                <strong>Negative Prompt:</strong> {imageInfo?.negativePrompt}
              </p>
              <p>
                <strong>Style:</strong> {imageInfo?.style}
              </p>
              <p>
                <strong>Room Type:</strong> {imageInfo?.roomType}
              </p>
              <p>
                <strong>Color:</strong> {imageInfo?.color}
              </p>
              <p>
                <strong>Material:</strong> {imageInfo?.material}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
