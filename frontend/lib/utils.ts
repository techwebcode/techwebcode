import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes safely.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format date
 * Example: Jul 16, 2026
 */
export function formatDate(
    date: string | Date,
    locale = "en-US"
) {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
}

/**
 * Format number
 * Example:
 * 1200 -> 1.2K
 */
export function formatNumber(
    value: number
) {
    return new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

/**
 * Reading Time
 */
export function calculateReadingTime(
    text: string
) {
    const words = text
        .trim()
        .split(/\s+/)
        .length;

    return Math.max(
        1,
        Math.ceil(words / 200)
    );
}

/**
 * Remove HTML tags
 */
export function stripHtml(
    html: string
) {
    return html.replace(/<[^>]*>/g, "");
}

/**
 * Truncate text
 */
export function truncate(
    text: string,
    length = 150
) {
    if (text.length <= length) {
        return text;
    }

    return text.substring(0, length) + "...";
}

/**
 * Generate slug
 */
export function slugify(
    text: string
) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

/**
 * Sleep helper
 */
export function sleep(ms: number) {
    return new Promise((resolve) =>
        setTimeout(resolve, ms)
    );
}