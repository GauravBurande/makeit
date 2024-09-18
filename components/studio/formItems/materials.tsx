import React, { useCallback } from "react";
import { Check, ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { materials } from "@/helpers/constants";

interface MaterialsSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MaterialsSelector({
  value,
  onChange,
}: MaterialsSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const getIconForMaterial = useCallback((material: string) => {
    const iconMap = {
      Silver: LucideIcons.CircleDollarSign,
      Brass: LucideIcons.Drum,
      Sandstone: LucideIcons.Mountain,
      Marble: LucideIcons.Columns,
      "Patterned Glass": LucideIcons.Layers,
      Leather: LucideIcons.Wallet,
      "Wrought Iron": LucideIcons.Hammer,
      Mahogany: LucideIcons.TreeDeciduous,
      Maple: LucideIcons.Leaf,
      "Colored Glass": LucideIcons.Palette,
      Terrazzo: LucideIcons.Sparkles,
      Jacquard: LucideIcons.Shirt,
      "Textured Glass": LucideIcons.Fingerprint,
      Bronze: LucideIcons.Medal,
      Cotton: LucideIcons.Shirt,
      Walnut: LucideIcons.Apple,
      Aluminum: LucideIcons.CookingPot,
      Copper: LucideIcons.Pipette,
      "Stainless Steel": LucideIcons.Utensils,
      Granite: LucideIcons.Mountain,
      Slate: LucideIcons.Tablet,
      Quartz: LucideIcons.Watch,
      Limestone: LucideIcons.Mountain,
      Oak: LucideIcons.TreeDeciduous,
      Pine: LucideIcons.TreePine,
      Cherry: LucideIcons.Cherry,
      Birch: LucideIcons.TreeDeciduous,
      "Clear Glass": LucideIcons.Glasses,
      "Frosted Glass": LucideIcons.CloudFog,
      "Stained Glass": LucideIcons.Palette,
      Silk: LucideIcons.Shirt,
      Velvet: LucideIcons.Shirt,
      Linen: LucideIcons.Shirt,
      Wool: LucideIcons.Shirt,
      Concrete: LucideIcons.Building2,
      Ceramic: LucideIcons.Shovel,
      Porcelain: LucideIcons.Coffee,
      Acrylic: LucideIcons.PaintBucket,
      Rattan: LucideIcons.Armchair,
      Bamboo: LucideIcons.Sprout,
      Cork: LucideIcons.Wine,
      Plywood: LucideIcons.Layers,
      Laminate: LucideIcons.Layers,
      Vinyl: LucideIcons.Disc,
      Tile: LucideIcons.LayoutGrid,
    };

    const IconComponent =
      iconMap[material as keyof typeof iconMap] || LucideIcons.CircleDashed;

    return <IconComponent className="mr-2 h-4 w-4" />;
  }, []);

  return (
    <FormItem>
      <FormLabel>
        Material <span className="text-xs text-foreground/60">(Optional)</span>
      </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value ? (
              getIconForMaterial(value)
            ) : (
              <LucideIcons.CircleDashed className="mr-2 h-4 w-4" />
            )}
            {value || "Select material..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command className="w-full">
            <CommandInput placeholder="Search material..." className="h-9" />
            <CommandList>
              <CommandEmpty>No material found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-y-auto">
                {materials.map((material) => (
                  <CommandItem
                    key={material}
                    value={material}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {getIconForMaterial(material)}
                    {material}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === material ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>
        Select what material for furniture and other objects you would like to
        see.
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
}
