import React from "react";
import { Check, ChevronDown } from "lucide-react";
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
import { colorSchemes } from "@/helpers/constants";

interface ColorsSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ColorSchemeSelector({
  value,
  onChange,
}: ColorsSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormItem>
      <FormLabel>
        Color Scheme{" "}
        <span className="text-xs text-foreground/60">(Optional)</span>
      </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full relative justify-center"
          >
            {value ? (
              <div className="flex items-center justify-center">
                {colorSchemes
                  .find((scheme) => scheme.name === value)
                  ?.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full mx-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                <span className="ml-2 pr-5">{value}</span>
              </div>
            ) : (
              "Select color scheme..."
            )}
            <ChevronDown className="absolute right-4 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search color scheme..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No color scheme found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {colorSchemes.map((scheme) => (
                  <CommandItem
                    key={scheme.name}
                    onSelect={() => {
                      onChange(scheme.name);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-start w-full">
                      {scheme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full mx-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <span className="ml-2">{scheme.name}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === scheme.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>Select which color scheme to use.</FormDescription>
      <FormMessage />
    </FormItem>
  );
}
