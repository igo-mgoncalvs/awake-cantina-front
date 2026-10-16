import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getArrayFromString<T>(str: string): T[] {
  if (str.startsWith("[") && str.endsWith("]")) {
    return JSON.parse(str) as T[];
  }

  return str.split(",") as T[];
}
