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
import { Trash, UploadCloud } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import StylesSelector from "./formItems/styles";
import RoomTypesSelector from "./formItems/roomTypes";
import ColorSelector from "./formItems/colors";
import MaterialsSelector from "./formItems/materials";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { TUser } from "@/helpers/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb

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
  prompt: z.string().max(3900),
  negativePrompt: z.string().max(3900).optional(),
  style: z.string().optional(),
  roomType: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
});

interface interiorFormProps {
  user: TUser;
}
export function InteriorDesignForm({ user }: interiorFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      beforeImage: "",
      prompt: "",
      negativePrompt:
        "lowres, watermark, banner, logo, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic, illustration, distorted, horror",
      style: "",
      roomType: "",
      color: "",
      material: "",
    },
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

  const { toast } = useToast();
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!user.hasAccess) {
      toast({
        title: "Uh oh! Have you upgraded?",
        variant: "destructive",
        description:
          "It seems like you don't have enough image credits or haven't purchased yet!",
        action: (
          <a href="/studio#upgrade">
            <ToastAction className="border-none" altText="Upgrade">
              <Button variant="default">Upgrade</Button>
            </ToastAction>
          </a>
        ),
      });
      return;
    } else {
      console.log(data);
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

  const handleFile = (file: File) => {
    // todo: Here upload the file to r2 cloud storage
    // For this we'll just create a local object URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    // todo: fix this later, objectUrl not the correct value maybe
    form.setValue("beforeImage", objectUrl);
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

  const clearInput = () => {
    form.setValue("beforeImage", "");
    setPreview("");
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
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="relative mt-4">
                          {
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={preview}
                              alt="Preview"
                              className="max-w-full h-auto max-h-64 object-contain"
                            />
                          }
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-0 right-0 m-2"
                            onClick={clearInput}
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
              <Button type="submit" className="w-full md:hidden">
                <span>Generate Interior Design</span>
              </Button>
            </form>
          </Form>
        </div>
      </ScrollArea>
      <div className="p-4 bg-background border-t border-r border-t-border">
        <Button
          type="submit"
          className="w-full hidden md:block"
          onClick={form.handleSubmit(onSubmit)}
        >
          Generate Interior Design
        </Button>
      </div>
    </div>
  );
}
