"use client";

import { useCallback, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { ImageIcon, Loader, Trash, UploadCloud } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import StylesSelector from "./formItems/styles";
import RoomTypesSelector from "./formItems/roomTypes";
import ColorSelector from "./formItems/colors";
import MaterialsSelector from "./formItems/materials";
import { useToast } from "@/hooks/use-toast";
import { PlainUser } from "@/helpers/types";
import Image from "next/image";
import { getPreviousImages } from "@/app/actions";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { cn } from "@/lib/utils";
import { useInteriorDesignForm } from "@/hooks/use-interior-design-form";

interface interiorFormProps {
  user: PlainUser;
}

export function InteriorDesignForm({ user }: interiorFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previousImages, setPreviousImages] = useState<string[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { toast } = useToast();
  const {
    form,
    isLoading,
    preview,
    setPreview,
    uploading,
    handleFile,
    handlePreviousImageSelect,
    clearImageInput,
    onSubmit,
  } = useInteriorDesignForm(user);

  const handleDrag = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handlePaste = (e: any) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        handleFile(file);
        break;
      }
    }
  };

  const loadPreviousImages = async () => {
    try {
      const images = await getPreviousImages();
      setPreviousImages(images?.reverse() || []);
    } catch (error) {
      console.error("Error fetching previous images:", error);
      toast({
        variant: "destructive",
        title: "Failed to load images",
        description: "Could not fetch previously uploaded images.",
      });
    }
  };

  return (
    <section className="flex flex-col h-full min-w-[24rem] md:h-[calc(100vh-80px)] md:max-h-[calc(100vh-80px)]">
      <ScrollArea>
        <div className="flex-grow border-r border-t-border p-4 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="beforeImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Image</FormLabel>
                    <div
                      className={`border rounded-md p-4 ${
                        dragActive ? "border-primary" : "border-accent/20"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onPaste={handlePaste}
                    >
                      {!preview ? (
                        uploading ? (
                          <div className="flex items-center justify-center">
                            <Loader className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <div className="relative">
                              <Input
                                type="text"
                                readOnly={preview === null ? false : true}
                                placeholder="Enter a URL, paste a file, or drag a file over."
                                className="mb-2"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (
                                    e.target.value.startsWith("https://") &&
                                    /\.(png|jpg|jpeg|webp)$/i.test(
                                      e.target.value
                                    )
                                  ) {
                                    setPreview(e.target.value);
                                  }
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-center gap-4">
                              <label
                                htmlFor="file-upload-beforeImage"
                                className={cn(
                                  buttonVariants({
                                    variant: "outline",
                                    size: "xs",
                                  }),
                                  "text-foreground/60 gap-1 cursor-pointer"
                                )}
                              >
                                <UploadCloud className="w-5 h-5" />
                                <span>Upload the image</span>
                              </label>
                              <input
                                id="file-upload-beforeImage"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={handleChange}
                                className="hidden"
                              />
                              <Sheet
                                open={isSheetOpen}
                                onOpenChange={setIsSheetOpen}
                              >
                                <SheetTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={loadPreviousImages}
                                    className="flex items-center text-foreground/60 gap-2"
                                  >
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Previous Uploads</span>
                                  </Button>
                                </SheetTrigger>
                                <SheetContent
                                  side="right"
                                  className="w-[80vw] sm:w-[80vw]"
                                >
                                  <SheetHeader>
                                    <SheetTitle>Previous Uploads</SheetTitle>
                                  </SheetHeader>
                                  {previousImages.length > 0 ? (
                                    <div className="flex flex-wrap gap-4 mt-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                                      {previousImages.map((image, index) => (
                                        <div
                                          key={index}
                                          className="relative cursor-pointer w-72 h-44"
                                          onClick={() =>
                                            handlePreviousImageSelect(image)
                                          }
                                        >
                                          <Image
                                            src={image}
                                            alt={`Previous upload ${index + 1}`}
                                            fill
                                            className="object-cover rounded-md"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-full w-full">
                                      <SheetClose>
                                        No previous uploads
                                      </SheetClose>
                                    </div>
                                  )}
                                </SheetContent>
                              </Sheet>
                            </div>
                          </>
                        )
                      ) : (
                        <div className="relative">
                          <Image
                            src={preview}
                            alt="Preview"
                            width={800}
                            height={450}
                            className="max-w-full h-auto max-h-64 object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-0 right-0 m-2"
                            onClick={clearImageInput}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="text-xs">clear input</span>
                          </Button>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <Textarea
                      placeholder="Describe the desired interior design..."
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="negativePrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Negative Prompt</FormLabel>
                    <Textarea
                      placeholder="Describe what you don't want in the design..."
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <StylesSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <RoomTypesSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <ColorSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <MaterialsSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full capitalize md:hidden"
              >
                {isLoading ? (
                  <>
                    <span className="flex items-center justify-center">
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      processing request...
                    </span>
                  </>
                ) : (
                  "Generate interior design"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </ScrollArea>
      <div className="p-4 bg-background border-t border-r border-t-border">
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full capitalize hidden md:block"
          onClick={form.handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <>
              <span className="flex items-center justify-center">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                processing request...
              </span>
            </>
          ) : (
            "Generate interior design"
          )}
        </Button>
      </div>
    </section>
  );
}
