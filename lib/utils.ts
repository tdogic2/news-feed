import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "An unexpected error occurred.";
  }

  return message;
}

export function handleError(error: unknown, context?: string) {
  const message = getErrorMessage(error);
  const errorMessage = context
    ? `❌ ERROR (${context}): ${message}`
    : `❌ ERROR: ${message}`;

  console.error(errorMessage);

  return { error: message };
}
