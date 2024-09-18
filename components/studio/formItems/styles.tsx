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
import { styles } from "@/helpers/constants";

interface StylesSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StylesSelector({
  value,
  onChange,
}: StylesSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const getIconForStyle = useCallback((style: string) => {
    const iconMap = {
      Modern: LucideIcons.Hexagon,
      Contemporary: LucideIcons.Triangle,
      Minimalist: LucideIcons.Minus,
      Scandinavian: LucideIcons.Snowflake,
      Industrial: LucideIcons.Factory,
      "Mid-Century Modern": LucideIcons.Clock,
      "Art Deco": LucideIcons.Sparkles,
      Traditional: LucideIcons.Landmark,
      Transitional: LucideIcons.ArrowLeftRight,
      Rustic: LucideIcons.TreePine,
      Farmhouse: LucideIcons.Home,
      Country: LucideIcons.Wheat,
      Coastal: LucideIcons.Waves,
      Mediterranean: LucideIcons.Sun,
      Bohemian: LucideIcons.Flower2,
      Eclectic: LucideIcons.Palette,
      Vintage: LucideIcons.Watch,
      Retro: LucideIcons.Radio,
      Victorian: LucideIcons.Crown,
      Georgian: LucideIcons.Building,
      Colonial: LucideIcons.Flag,
      Neoclassical: LucideIcons.Pilcrow,
      Gothic: LucideIcons.Church,
      Baroque: LucideIcons.Church,
      Rococo: LucideIcons.Feather,
      Asian: LucideIcons.Cherry,
      Japanese: LucideIcons.Fan,
      Zen: LucideIcons.Leaf,
      Moroccan: LucideIcons.Lamp,
      Tropical: LucideIcons.TreePalm,
      "Hollywood Regency": LucideIcons.Star,
      "Shabby Chic": LucideIcons.Heart,
      "French Country": LucideIcons.Croissant,
      Tuscan: LucideIcons.Grape,
      Southwestern: LucideIcons.MountainSnow,
      "Art Nouveau": LucideIcons.Flower,
      Bauhaus: LucideIcons.Square,
      Brutalist: LucideIcons.Box,
      Futuristic: LucideIcons.Rocket,
      Steampunk: LucideIcons.Cog,
      "Wabi-Sabi": LucideIcons.Leaf,
      Memphis: LucideIcons.Shapes,
      Postmodern: LucideIcons.Zap,
      Urban: LucideIcons.Building2,
      Loft: LucideIcons.Warehouse,
      Nautical: LucideIcons.Anchor,
      Lodge: LucideIcons.Mountain,
      "High-Tech": LucideIcons.Cpu,
      Maximalist: LucideIcons.Maximize,
    };

    const IconComponent =
      iconMap[style as keyof typeof iconMap] || LucideIcons.Paintbrush;

    return <IconComponent className="mr-2 h-4 w-4" />;
  }, []);

  return (
    <FormItem>
      <FormLabel>
        Style <span className="text-xs text-foreground/60">(Optional)</span>
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
              getIconForStyle(value)
            ) : (
              <LucideIcons.Paintbrush className="mr-2 h-4 w-4" />
            )}
            {value || "Select style..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command className="w-full">
            <CommandInput placeholder="Search style..." className="h-9" />
            <CommandList>
              <CommandEmpty>No style found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-y-auto">
                {styles.map((style) => (
                  <CommandItem
                    key={style}
                    value={style}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {getIconForStyle(style)}
                    {style}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === style ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>Select the style of your room.</FormDescription>
      <FormMessage />
    </FormItem>
  );
}
