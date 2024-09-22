import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlainUser } from "@/helpers/types";
import { Loader } from "lucide-react";

interface imageGalleryProps {
  user: PlainUser;
}

const ImageGallery = ({ user }: imageGalleryProps) => {
  const images = (user?.interiorImages || []).map(({ imageUrl, imageId }) => ({
    imageUrl,
    imageId,
  }));

  return (
    <ScrollArea className="h-full">
      {images?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative aspect-video bg-foreground/10 rounded-lg overflow-hidden"
            >
              {img.imageUrl === "" ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-accent">
                  <Loader className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-sm font-medium">Generating image...</p>
                  <p className="text-xs mt-1">This may take a few minutes</p>
                </div>
              ) : (
                <Image
                  src={img.imageUrl}
                  alt={`Design ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full pb-10 md:min-h-[calc(100vh-80px)] flex flex-col gap-2 justify-center items-center">
          <p className="text-lg"> No interior images created by you yet!</p>
          <p className="text-accent">
            Start creating interior images right now!
          </p>
        </div>
      )}
    </ScrollArea>
  );
};

export default ImageGallery;
