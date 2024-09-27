"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Loader, Trash, UploadCloud } from "lucide-react";
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
import { revalidateStudioPath } from "@/lib/actions";

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
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const polling = async () => {
    console.log("polling started");
    await sleep(7000);
    console.log("initial 7s sleep");
    let sleepCount = 1000;

    const checkImages = async () => {
      while (true) {
        console.log("Checking user images");
        console.log("sleepCount:", sleepCount);

        // todo: relivalidate if not working in prod, ok?

        const hasEmptyImage = (user.interiorImages || []).some(
          (obj: any) => obj.imageUrl === ""
        );

        if (hasEmptyImage) {
          await sleep(sleepCount);
          sleepCount = Math.min(sleepCount * 2, 30000); // Cap at 30 seconds
        } else {
          const result = await revalidateStudioPath();
          router.refresh();
          console.log("All images are populated");
          break;
        }
      }
    };

    await checkImages();
    console.log("Polling completed");
  };

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (isLoading) return; // Prevent multiple submissions
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
    if (user.usedImages > user.imageLimit) {
      errorToast(
        "It seems like you have reached your image limit. Please upgrade your account to add more images."
      );
      return;
    }
    if (user.storageLimit < user.storageUsed) {
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
      form.reset({
        ...defaultValues,
        beforeImage: form.getValues("beforeImage"),
        prompt: form.getValues("prompt"),
      });
      router.refresh();
      await polling();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.name,
        description: error.message,
      });
      return;
    } finally {
      setIsLoading(false);
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

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10mb

  // todo: use this after r2 setup done
  // const handleFile = async (file: File) => {
  //   if (file.size > MAX_FILE_SIZE) {
  //     toast({
  //       variant: "destructive",
  //       title: "Image File is too large",
  //       description: "Maximum image file size is 10MB.",
  //     });
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("fileName", file.name);
  //     formData.append("fileSize", file.size.toString());
  //     formData.append("fileType", file.type);
  //     formData.append("userId", user._id);

  //     const response = await fetch("/api/image-upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       toast({
  //         variant: "destructive",
  //         title: "Upload failed",
  //         description: "Failed to upload image. Please try again.",
  //       });
  //     }

  //     const data = await response.json();
  //     const fileUrl = data.fileUrl;

  //     if (!fileUrl) {
  //       throw new Error("No file URL returned from server");
  //     }

  //     // Update preview and form value
  //     setPreview(fileUrl);
  //     form.setValue("beforeImage", fileUrl);

  //     toast({
  //       title: "Success",
  //       description: "Image uploaded successfully!",
  //     });
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     toast({
  //       variant: "destructive",
  //       title: "Image Upload failed",
  //       description: "Failed to upload image. Please try again.",
  //     });
  //   }
  // };

  const handleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      console.error("File is too large. Maximum size is 10MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const dataUrl = event.target.result as string;

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Set the form value with the data URL
        form.setValue("beforeImage", dataUrl);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    // Read the file as a data URL (base64)
    reader.readAsDataURL(file);
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

  return (
    <div className="flex flex-col h-full min-w-[24rem] md:h-[calc(100vh-80px)] md:max-h-[calc(100vh-80px)]">
      <ScrollArea>
        <div className="flex-grow border-r border-t-border p-4 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name={"beforeImage"}
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
                      <div className="relative">
                        <Input
                          type="text"
                          readOnly={preview === null ? false : true}
                          placeholder="Enter a URL, paste a file, or drag a file over."
                          className="mb-2"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value.startsWith("http")) {
                              setPreview(e.target.value);
                            }
                          }}
                        />
                      </div>
                      {!preview ? (
                        <div className="flex items-center justify-center">
                          <label
                            htmlFor={`file-upload-beforeImage`}
                            className="cursor-pointer text-foreground/60 flex items-center gap-1"
                          >
                            <UploadCloud className="w-5 h-5" />
                            <span>Upload a file</span>
                          </label>
                          <input
                            id={`file-upload-beforeImage`}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={handleChange}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="relative mt-4">
                          {
                            <Image
                              src={preview}
                              alt="Preview"
                              width={800}
                              height={450}
                              className="max-w-full h-auto max-h-64 object-contain"
                            />
                          }
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
