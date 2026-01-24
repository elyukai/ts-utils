import { isInteger, isNaturalNumber } from "./regex.ts"

/**
 * The minus sign.
 */
export const minus = "−"

/**
 * The plus/minus sign.
 */
export const plusMinus = "\xB1"

/**
 * Forces signing on the given number, returning `undefined` on zero.
 */
export const signIgnoreZero = (x: number): string | undefined =>
  x > 0
    ? `+${x.toString()}`
    : x < 0
      ? `${minus}\u2060${Math.abs(x).toString()}`
      : undefined

/**
 * Forces signing on the given number.
 */
export const sign = (x: number): string =>
  x > 0
    ? `+${x.toString()}`
    : x < 0
      ? `${minus}\u2060${Math.abs(x).toString()}`
      : "0"

/**
 * Returns the sign of the given number. Returns `undefined` if the number is
 * zero.
 */
export const signStr = (x: number): string | undefined =>
  x > 0 ? "+" : x < 0 ? minus : undefined

/**
 * Converts a string to an integer. If the string is not a valid integer, it
 * returns `undefined`.
 */
export const parseInt = (str: string): number | undefined =>
  str.length > 0 && isInteger(str) ? Number.parseInt(str, 10) : undefined

/**
 * Converts a string to a natural number. If the string is not a valid natural
 * number, it returns `undefined`.
 */
export const parseNat = (str: string): number | undefined =>
  str.length > 0 && isNaturalNumber(str) ? Number.parseInt(str, 10) : undefined
