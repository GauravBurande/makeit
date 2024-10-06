import { InteriorDesignForm } from "@/components/studio/InteriorForm";
import { PricingDialog } from "@/components/pricing";
import ImageGallery from "@/components/studio/imageGallery";
import { getUser } from "@/lib/db";
import { redirect } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const dynamic = "force-dynamic";

export type TFormSchema = z.infer<typeof FormSchema>;

export type FormType = typeof form;

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

const Studio = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }

  return (
    <main className="flex flex-col w-screen md:flex-row md:h-[calc(100vh-80px)] md:max-h-[calc(100vh-80px)]">
      <PricingDialog />
      <div className="w-full md:w-1/3 md:max-w-md">
        <InteriorDesignForm
          form={form}
          defaultValues={defaultValues}
          user={user}
        />
      </div>
      <div className="w-full md:w-2/3 md:flex-grow md:ml-2">
        <ImageGallery user={user} />
      </div>
    </main>
  );
};

export default Studio;
