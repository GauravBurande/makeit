"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { ToastAction } from "../ui/toast";
import { PlainUser } from "@/helpers/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sleep } from "@/helpers/utils";
import { getPreviousImages, getUserForPolling } from "@/lib/actions";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  beforeImage: z
    .string()
    .refine(
      (val) =>
        val.startsWith("data:image") ||
        val.startsWith("blob") ||
        val.startsWith("http"),
      {
        message: "Please provide a valid image input",
      }
    ),
  prompt: z.string().min(10).max(3900),
  negativePrompt: z.string().max(3900).optional(),
  style: z.string().optional(),
  roomType: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
});

interface interiorFormProps {
  user: PlainUser;
}
export function InteriorDesignForm({ user }: interiorFormProps) {
  const predictionsRef = useRef<any>([]);

  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [previousImages, setPreviousImages] = useState<string[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const defaultValues = {
    beforeImage: "",
    prompt: "",
    negativePrompt:
      "lowres, watermark, banner, logo, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic, illustration, distorted, horror",
    style: "",
    roomType: "",
    color: "",
    material: "",
  };

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const LOCALSTORAGE_FORM_KEY = "interiorDesignFormData";

  useEffect(() => {
    // Load form data from localStorage when component mounts
    const storedData = localStorage.getItem(LOCALSTORAGE_FORM_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      Object.keys(parsedData).forEach((key) => {
        form.setValue(key as any, parsedData[key]);
      });
      if (parsedData.beforeImage) {
        setPreview(parsedData.beforeImage);
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(LOCALSTORAGE_FORM_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form]);

  const PredictionLimits: any = {
    Personal: 4,
    Pro: 8, // keep it to 8, 2 is just for testing
    Premium: 16,
  };

  const updateLoadingState = useCallback(
    (userData: any) => {
      const userPlan = userData.plan || "Personal";
      const limit = PredictionLimits[userPlan] || PredictionLimits.Personal;
      setIsLoading(predictions.length >= limit);
    },
    [predictions]
  );

  const polling = useCallback(async () => {
    console.log("Polling started");
    console.log("Initial 7s sleep completed");

    let totalAttempts = 0;
    const MAX_ATTEMPTS = 20;
    let sleepCount = 1000;

    const checkImages = async () => {
      while (
        predictionsRef.current.length > 0 &&
        totalAttempts < MAX_ATTEMPTS
      ) {
        totalAttempts++;
        console.log(
          `Attempt ${totalAttempts}: Checking user images. Remaining predictions: ${predictionsRef.current.length}`
        );
        console.log(`Current sleep duration: ${sleepCount}ms`);

        try {
          const { user: userData } = (await getUserForPolling()) as {
            user: PlainUser;
          };

          if (!userData || !userData.interiorImages) {
            console.log(
              "User data or interior images not available. Waiting..."
            );
            await sleep(sleepCount);
            sleepCount = Math.min(sleepCount * 2, 30000);
            continue;
          }

          const pendingImages = userData.interiorImages.filter(
            (obj) =>
              obj.imageUrl === "" &&
              predictionsRef.current.includes(obj.imageId)
          );

          if (pendingImages.length > 0) {
            console.log(
              `${pendingImages.length} images still pending. Waiting...`
            );
            await sleep(sleepCount);
            sleepCount = Math.min(sleepCount * 2, 30000);
          } else {
            const processedImageIds = userData.interiorImages
              .filter(
                (obj) =>
                  obj.imageUrl !== "" &&
                  predictionsRef.current.includes(obj.imageId)
              )
              .map((obj) => obj.imageId);

            if (processedImageIds.length > 0) {
              predictionsRef.current = predictionsRef.current.filter(
                (pred: any) => !processedImageIds.includes(pred)
              );
              setPredictions(predictionsRef.current);

              console.log(
                `Processed ${processedImageIds.length} images. ${predictionsRef.current.length} predictions remaining.`
              );
              sleepCount = 1000;
              totalAttempts = 0;
              updateLoadingState(userData);
              router.refresh();
            } else {
              console.log("No new images processed in this attempt.");
              sleepCount = Math.min(sleepCount * 2, 30000);
            }
          }
        } catch (error) {
          console.error("Error during polling:", error);
          await sleep(sleepCount);
          sleepCount = Math.min(sleepCount * 2, 30000);
        }
      }

      if (totalAttempts >= MAX_ATTEMPTS) {
        console.log("Max attempts reached. Stopping polling.");
      }
    };

    await checkImages();
    console.log("Polling completed");
  }, [updateLoadingState, router]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (isLoading) return;

    const errorToast = (message: string) => {
      toast({
        title: "Uh oh! Have you upgraded?",
        description: message,
        variant: "destructive",
        action: (
          <a href="/studio#upgrade">
            <ToastAction className="border-none" altText="Upgrade">
              <Button variant="default">Upgrade</Button>
            </ToastAction>
          </a>
        ),
      });
    };

    if (!user.hasAccess) {
      errorToast("It seems like you haven't purchased yet!");
      return;
    }

    const userPlan = user.plan || "Personal";
    const predictionLimit =
      PredictionLimits[userPlan] || PredictionLimits.Personal;

    if (predictions.length >= predictionLimit) {
      errorToast(
        `You've reached the maximum number of predictions for your ${userPlan} plan. Please wait for some predictions to complete or upgrade your plan.`
      );
      return;
    }

    if (user.usedImages >= user.imageLimit) {
      errorToast(
        "It seems like you have reached your image limit. Please upgrade your account to add more images."
      );
      return;
    }

    if (user.storageLimit <= user.storageUsed) {
      errorToast(
        "It seems like you have reached your storage limit. Please upgrade."
      );
      return;
    }

    setIsLoading(true);

    const {
      beforeImage,
      prompt,
      negativePrompt,
      style,
      roomType,
      color,
      material,
    } = data;

    try {
      const response = await fetch("/api/prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        next: {
          revalidate: 0,
        },
        body: JSON.stringify({
          userId: user._id,
          image: beforeImage,
          prompt,
          negativePrompt,
          style,
          roomType,
          color,
          material,
        }),
      });
      const predictionData = await response.json();
      console.log(predictionData);
      if (response.status !== 201) {
        toast({
          variant: "destructive",
          title: response.statusText,
          description: predictionData.message,
        });
        return;
      }
      let pollingTimeout: NodeJS.Timeout;

      predictionsRef.current = [
        ...predictionsRef.current,
        predictionData.interiorImageId,
      ];
      setPredictions(predictionsRef.current);
      updateLoadingState({ ...user, plan: userPlan });
      form.reset({
        ...defaultValues,
        beforeImage: form.getValues("beforeImage"),
        prompt: form.getValues("prompt"),
      });
      pollingTimeout = setTimeout(() => {
        polling();
      }, 7000);
      router.refresh();
      return () => {
        if (pollingTimeout) {
          clearTimeout(pollingTimeout);
        }
      };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.name,
        description: error.message,
      });
    } finally {
      localStorage.removeItem(LOCALSTORAGE_FORM_KEY);
    }
  };

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

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "Image File is too large",
        description: "Maximum image file size is 5MB.",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("fileSize", file.size.toString());
      formData.append("fileType", file.type);
      formData.append("userId", user._id);

      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      const fileUrl = data.fileUrl;

      if (!fileUrl) {
        throw new Error("No file URL returned from server");
      }

      setPreview(fileUrl);
      form.setValue("beforeImage", fileUrl);

      toast({
        title: "Done!",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Image Upload failed",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploading(false);
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

  const clearImageInput = () => {
    form.setValue("beforeImage", "");
    setPreview(null);
  };

  const handlePreviousImageSelect = (imageUrl: string) => {
    setPreview(imageUrl);
    form.setValue("beforeImage", imageUrl);
    setIsSheetOpen(false);
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
    <div className="flex flex-col h-full min-w-[24rem] md:h-[calc(100vh-80px)] md:max-h-[calc(100vh-80px)]">
      <ScrollArea>
        <div className="flex-grow border-r border-t-border p-4 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="beforeImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
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
    </div>
  );
}
