import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const imageUrl = (fileName) => {
  return `https://kgdfprpbmoqappauumjb.supabase.co/storage/v1/object/public/project-images/${fileName}`;
};
