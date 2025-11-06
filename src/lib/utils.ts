import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges CSS class names intelligently.
 * Uses clsx to handle conditional classes and twMerge to resolve Tailwind CSS conflicts.
 *
 * @param inputs - Multiple class values (strings, arrays, objects with boolean values)
 * @returns A single merged className string with Tailwind conflicts resolved
 *
 * @example
 * cn('px-4 py-2', 'bg-blue-500', { 'text-white': true, 'hidden': false })
 * // Returns: "px-4 py-2 bg-blue-500 text-white"
 *
 * @example
 * cn('p-4', 'p-8') // Tailwind conflict resolution
 * // Returns: "p-8" (conflicting p-4 is removed)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
