import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Expense } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToJSON(data: Expense[]) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `pocketledger_expenses_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}

export function exportToCSV(data: Expense[]) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(fieldName =>
        JSON.stringify(row[fieldName as keyof Expense], (key, value) => value === null ? '' : value)
      ).join(',')
    )
  ];

  const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(
    csvRows.join('\r\n')
  )}`;
  const link = document.createElement("a");
  link.href = csvString;
  link.download = `pocketledger_expenses_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}
