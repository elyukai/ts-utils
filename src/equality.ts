/**
 * Utility functions for testing for equality.
 * @module
 */

/**
 * A function that compares two values for equality.
 */
export type Equality<T> = (a: T, b: T) => boolean

/**
 * A function that compares two numbers for equality.
 */
export type NumberEquality = Equality<number>

/**
 * Checks if the first number is less than the second number.
 */
export const lt: NumberEquality = (a, b) => a < b

/**
 * Checks if the first number is less than or equal to the second number.
 */
export const lte: NumberEquality = (a, b) => a <= b

/**
 * Checks if the first number is greater than the second number.
 */
export const gt: NumberEquality = (a, b) => a > b

/**
 * Checks if the first number is greater than or equal to the second number.
 */
export const gte: NumberEquality = (a, b) => a >= b

/**
 * Checks if two values are (shallowly) equal.
 */
export const equal = <T>(a: T, b: T): boolean => Object.is(a, b)

/**
 * Checks if two numbers are not (shallowly) equal.
 */
export const notEqual = <T>(a: T, b: T): boolean => !Object.is(a, b)

/**
 * Checks if two arrays are equal. The values are compared shallowly.
 *
 * Use {@link deepEqual} for a deep equality check.
 */
export const arrayEqual = <
  T extends number | boolean | string | symbol | null | undefined,
>(
  arr1: T[],
  arr2: T[],
): boolean =>
  arr1.length === arr2.length &&
  arr1.every((value, index) => equal(value, arr2[index]))

/**
 * Checks two values for value equality. This is a deep equality check that
 * works for all types, including objects and arrays. For objects, it only
 * compares all enumerable keys, no other properties or the prototype chain.
 */
export const deepEqual = <T>(a: T, b: T): boolean => {
  if (equal(a, b)) {
    return true
  }

  if (
    typeof a === "object" &&
    typeof b === "object" &&
    a !== null &&
    b !== null
  ) {
    const keys = Object.keys(a)
    if (keys.length !== Object.keys(b).length) {
      return false
    }
    return keys.every(
      (key) =>
        key in b &&
        deepEqual(a[key as keyof typeof a], b[key as keyof typeof b]),
    )
  }

  return false
}
