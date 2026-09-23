/**
 * CSV for French spreadsheet software: UTF-8 with BOM, semicolon separator,
 * CRLF line endings and decimal commas.
 */

const SEPARATOR = ';';
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

/**
 * Quotes a value when needed and neutralises spreadsheet formulas that could
 * be injected through user-controlled text such as names (CSV injection).
 */
export function escapeCsvValue(value: string): string {
  const safe = FORMULA_PREFIX.test(value) ? `'${value}` : value;

  return /[";\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(rows: string[][]): string {
  return `﻿${rows.map((row) => row.map(escapeCsvValue).join(SEPARATOR)).join('\r\n')}\r\n`;
}

/** Minutes as decimal hours with a comma, e.g. 450 -> "7,50". */
export function formatDecimalHours(minutes: number): string {
  return (minutes / 60).toFixed(2).replace('.', ',');
}

/** Day count with a comma, e.g. 1.5 -> "1,5". */
export function formatDays(days: number): string {
  return String(days).replace('.', ',');
}
