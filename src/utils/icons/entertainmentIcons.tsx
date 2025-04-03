
import React from "react";
import {
  Film,
  Theater,
  Landmark,
  Music,
  Palmtree,
  Gamepad2,
  Snowflake,
  Waves,
  PartyPopper,
  Tent,
  Music2, // Using Music2 instead of Microphone which is not available in lucide-react
  Trees,
} from "lucide-react";
import clsx from "clsx"; // Better management of dynamic classes

// 🎨 Configuration of icons and associated colors
const entertainmentIcons: Record<string, { icon: React.FC<any>; color: string }> = {
  // Main entertainment category
  divertissement: { icon: Film, color: "text-purple-500" },
  
  // Entertainment subcategories
  cinemas: { icon: Film, color: "text-purple-600" },
  theatres: { icon: Theater, color: "text-purple-400" },
  musees: { icon: Landmark, color: "text-yellow-700" },
  "parcs-attractions": { icon: PartyPopper, color: "text-red-500" },
  "salles-concert": { icon: Music, color: "text-blue-500" },
  clubs: { icon: Music2, color: "text-indigo-500" }, // Using Music2 as alternative to Microphone
  parcs: { icon: Trees, color: "text-green-600" },
  "centres-loisirs": { icon: Gamepad2, color: "text-pink-500" },
  bowling: { icon: Tent, color: "text-gray-700" },
  patinoires: { icon: Snowflake, color: "text-blue-300" },
  piscines: { icon: Waves, color: "text-blue-500" },
  plages: { icon: Palmtree, color: "text-yellow-600" },
};

// 🔥 Function to get the icon
export const getEntertainmentIcon = (categoryId: string, className: string, colorOverride?: string) => {
  // Handle the case of kebab-case keys
  const category = entertainmentIcons[categoryId];

  if (!category) return null; // If the category doesn't exist, return null

  const { icon: Icon, color } = category;

  return <Icon className={clsx(className, colorOverride || color)} />;
};
