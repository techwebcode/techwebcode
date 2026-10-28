import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any fast-changing value.
 * Used for text input search, heavy parsing, and syntax validations
 * to prevent blocking the JavaScript main thread.
 *
 * @param value The value to debounce
 * @param delayMs Debounce delay in milliseconds (default: 250ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delayMs: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

