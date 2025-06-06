import { useState, useEffect, useRef, useCallback } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import { PlainUser } from "@/helpers/types";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { getUserForPolling } from "@/app/actions";
import { sleep } from "@/helpers/utils";

const LOCALSTORAGE_FORM_KEY = "interiorDesignFormData";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

type TFormSchema = z.infer<typeof FormSchema>;

export const useInteriorDesignForm = (user: PlainUser) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const predictionsRef = useRef<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const defaultValues = {
    beforeImage: "",
    prompt: "",
    negativePrompt:
      "lowres, watermark, banner, logo, contactinfo, text, deformed, blurry, grained, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic, illustration, distorted, horror",
    style: "",
    roomType: "",
    color: "",
    material: "",
  };

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  useEffect(() => {
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
    [predictions, PredictionLimits]
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

  const onSubmit = async (data: TFormSchema) => {
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
      }, 35000);
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
      setIsLoading(false);
    }
  };

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

  const clearImageInput = () => {
    form.setValue("beforeImage", "");
    setPreview(null);
  };

  const handlePreviousImageSelect = (imageUrl: string) => {
    setPreview(imageUrl);
    form.setValue("beforeImage", imageUrl);
  };

  return {
    form,
    isLoading,
    uploading,
    preview,
    predictions,
    setPreview,
    onSubmit,
    handleFile,
    clearImageInput,
    handlePreviousImageSelect,
  };
};
