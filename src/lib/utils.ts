import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTicketNumber(
  ticketNumber: number,
  totalTickets: number
): string {
  const digits = totalTickets.toString().length;
  return ticketNumber.toString().padStart(digits, "0");
}
