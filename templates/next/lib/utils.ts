import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// this is unneeded -- remove
export function convertPrettyId(prettyId: string): string {
  // Split the prettyId by '.' to separate the hexadecimal parts
  const parts = prettyId.split('.');

  // Convert each part from hexadecimal to decimal
  const decimalParts = parts.map((part) => parseInt(part, 16).toString());

  // Rejoin the converted parts with '.' to form the final string
  return decimalParts.join('.');
}
