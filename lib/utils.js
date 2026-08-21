import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This is the "cn" function your component is looking for
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}