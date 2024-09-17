import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageData {
  src: string;
}

const ImageGallery: React.FC = () => {
  const images: ImageData[] = [
    { src: "/designs/1.png" },
    { src: "/designs/2.png" },
    { src: "/designs/3.png" },
    { src: "/designs/4.png" },
    { src: "/designs/5.png" },
    { src: "/designs/6.png" },
    { src: "/designs/7.png" },
    { src: "/designs/8.png" },
    { src: "/designs/9.png" },
    { src: "/designs/10.png" },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {images.map((img, index) => (
          <div key={index} className="relative aspect-video">
            <Image
              src={img.src}
              alt={`Design ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ImageGallery;
