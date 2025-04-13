
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce function to limit how often a function can be called
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

// Convert between different distance units
export function convertDistance(value: number, fromUnit: string, toUnit: string): number {
  // Convert to meters first
  let meters: number;
  switch (fromUnit) {
    case 'km':
      meters = value * 1000;
      break;
    case 'mi':
    case 'miles':
      meters = value * 1609.34;
      break;
    case 'm':
      meters = value;
      break;
    default:
      meters = value;
  }

  // Convert from meters to target unit
  switch (toUnit) {
    case 'km':
      return meters / 1000;
    case 'mi':
    case 'miles':
      return meters / 1609.34;
    case 'm':
      return meters;
    default:
      return meters;
  }
}

// Format duration in minutes to a readable format
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${remainingMinutes} min`;
}
