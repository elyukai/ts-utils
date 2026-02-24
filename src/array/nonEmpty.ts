/**
 * Types and functions to check for non-empty arrays.
 * @module
 */

/**
 * The empty array type.
 */
export type EmptyArray = []

/**
 * A type representing a non-empty array, i.e., an array with at least one element.
 */
export type NonEmptyArray<T> = [T, ...T[]]

declare global {
  interface Array<T> {
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map<U>(
      this: NonEmptyArray<T>,
      callbackfn: (value: T, index: number, array: T[]) => U,
      thisArg?: unknown,
    ): NonEmptyArray<U>
  }
}

/**
 * Checks if the array is empty.
 */
export const isEmpty = (arr: unknown[]): arr is EmptyArray => arr.length === 0

/**
 * Checks if the array is not empty, i.e., contains at least one element.
 */
export const isNotEmpty = <T>(arr: T[]): arr is NonEmptyArray<T> =>
  !isEmpty(arr)

/**
 * Returns `undefined` if the array is empty, otherwise the non-empty array.
 */
export const ensureNonEmpty = <T>(arr: T[]): NonEmptyArray<T> | undefined =>
  isNotEmpty(arr) ? arr : undefined
