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
import { roomTypes } from "@/helpers/constants";

interface RoomTypesSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RoomTypesSelector({
  value,
  onChange,
}: RoomTypesSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const getIconForRoomType = useCallback((roomType: string) => {
    const iconMap = {
      "Living Room": LucideIcons.Sofa,
      "Dining Room": LucideIcons.UtensilsCrossed,
      Kitchen: LucideIcons.Utensils,
      Bedroom: LucideIcons.Bed,
      "Master Bedroom": LucideIcons.BedDouble,
      Bathroom: LucideIcons.Bath,
      "Ensuite Bathroom": LucideIcons.ShowerHead,
      "Powder Room": LucideIcons.Droplets,
      "Home Office": LucideIcons.Briefcase,
      Study: LucideIcons.BookOpen,
      Library: LucideIcons.Library,
      "Family Room": LucideIcons.Users,
      Playroom: LucideIcons.Gamepad2,
      Nursery: LucideIcons.Baby,
      "Guest Room": LucideIcons.BedSingle,
      Mudroom: LucideIcons.Umbrella,
      "Laundry Room": LucideIcons.WashingMachine,
      Pantry: LucideIcons.Apple,
      "Walk-in Closet": LucideIcons.Shirt,
      Attic: LucideIcons.Warehouse,
      Basement: LucideIcons.ArrowDownToLine,
      Garage: LucideIcons.Car,
      Sunroom: LucideIcons.Sun,
      Conservatory: LucideIcons.Flower2,
      "Conference Room": LucideIcons.Users,
      "Meeting Room": LucideIcons.UsersRound,
      "Open Office": LucideIcons.LayoutGrid,
      "Private Office": LucideIcons.Lock,
      "Reception Area": LucideIcons.Bell,
      "Waiting Room": LucideIcons.Clock,
      "Break Room": LucideIcons.Coffee,
      Cafeteria: LucideIcons.UtensilsCrossed,
      Auditorium: LucideIcons.Theater,
      Classroom: LucideIcons.School2,
      Laboratory: LucideIcons.FlaskConical,
      Workshop: LucideIcons.Hammer,
      "Hotel Room": LucideIcons.Hotel,
      Suite: LucideIcons.Star,
      Lobby: LucideIcons.Armchair,
      "Restaurant Dining Area": LucideIcons.UtensilsCrossed,
      Bar: LucideIcons.Wine,
      Lounge: LucideIcons.Armchair,
      "Home Theater": LucideIcons.Clapperboard,
      "Game Room": LucideIcons.Dice5,
      Gym: LucideIcons.Dumbbell,
      "Wine Cellar": LucideIcons.Wine,
      Sauna: LucideIcons.Flame,
      "Meditation Room": LucideIcons.Brain,
      "Art Studio": LucideIcons.Palette,
      "Music Room": LucideIcons.Music,
      Greenhouse: LucideIcons.Sprout,
    };

    const IconComponent =
      iconMap[roomType as keyof typeof iconMap] || LucideIcons.LayoutDashboard;

    return <IconComponent className="mr-2 h-4 w-4" />;
  }, []);

  return (
    <FormItem>
      <FormLabel>
        Room Type <span className="text-xs text-foreground/60">(Optional)</span>
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
              getIconForRoomType(value)
            ) : (
              <LucideIcons.LayoutDashboard className="mr-2 h-4 w-4" />
            )}
            {value || "Select room type..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command className="w-full">
            <CommandInput placeholder="Search room type..." className="h-9" />
            <CommandList>
              <CommandEmpty>No room type found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-y-auto">
                {roomTypes.map((roomType) => (
                  <CommandItem
                    key={roomType}
                    value={roomType}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {getIconForRoomType(roomType)}
                    {roomType}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === roomType ? "opacity-100" : "opacity-0"
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
        Select the type of room you want to create.
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
}
