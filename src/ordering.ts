/**
 * Utility functions for ordering values.
 * @module
 */

import { isNullish, type AnyNonNullish } from "./nullable.js"

/**
 * The type of a compare function that can be used to sort values.
 * @returns A negative number if `a` should be sorted before `b`, a positive
 * number if `a` should be sorted after `b`, or zero if `a` and `b` are equal.
 */
export type Compare<T> = (a: T, b: T) => number

/**
 * Build a compare function that nests multiple compare functions. The functions
 * are applied in order, so the first function is the primary sort key, the
 * second function is the secondary sort key, and so on.
 */
export const reduceCompare =
  <T>(...compares: Compare<T>[]): Compare<T> =>
  (a, b) => {
    for (const compare of compares) {
      const result = compare(a, b)
      if (result !== 0) {
        return result
      }
    }

    return 0
  }

/**
 * Compare function for numbers that sorts them in ascending order.
 */
export const compareNumber: Compare<number> = (a, b) => a - b

/**
 * Compare function for {@link Date} objects in ascending order.
 */
export const compareDate: Compare<Date> = (a, b) => a.getTime() - b.getTime()

/**
 * Higher-order compare function that extends a compare function to also handle
 * `null` and `undefined` values. Nullish values are always sorted last.
 */
export const compareNullish =
  <T extends AnyNonNullish>(compare: Compare<T>) =>
  (a: T | null | undefined, b: T | null | undefined): number => {
    if (isNullish(a) && isNullish(b)) {
      return 0
    }

    if (isNullish(a)) {
      return 1
    }

    if (isNullish(b)) {
      return -1
    }

    return compare(a, b)
  }

/**
 * A function that reverses the order of a compare function.
 */
export const reverse =
  <T>(compare: Compare<T>): Compare<T> =>
  (a, b) => {
    const res = compare(a, b)
    return res === 0 ? 0 : -res
  }
