import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toDateTimeFormat(dateTime: string){
  return new Date(dateTime).toDateString();
}

export function getMediaUrl(url: string | undefined | null): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api/v1";
    try {
        const origin = new URL(apiBase).origin;
        return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
    } catch {
        return url;
    }
}