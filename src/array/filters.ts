/**
 * Utility functions for filtering arrays.
 * @module
 */

import { isNotEmpty } from "./nonEmpty.ts"

/**
 * Filters out duplicate values from an array. Objects are not supported, since
 * they don’t provide value equality semantics.
 */
export const unique = <T extends number | boolean | string | symbol | null | undefined>(
  arr: readonly T[],
): T[] => Array.from(new Set(arr))

/**
 * Checks if there are any duplicate elements in the array.
 */
export const anySame = <T>(
  arr: readonly T[],
  equalityCheck: (a: T, b: T) => boolean = (a, b) => a === b,
): boolean =>
  arr.some((item, index) => arr.findIndex(other => equalityCheck(item, other)) !== index)

/**
 * Checks if there are any duplicate elements in the array and returns an array
 * of found duplicates where the values are the indices of these values.
 */
export const anySameIndices = <T>(
  arr: readonly T[],
  equalityCheck: (a: T, b: T) => boolean = (a, b) => a === b,
): number[][] =>
  arr.reduce((acc: number[][], item, index) => {
    const firstIndex = arr.findIndex(other => equalityCheck(item, other))
    if (firstIndex === index) {
      return acc
    }
    const accIndex = acc.findIndex(accElem => accElem[0] === firstIndex)
    return accIndex === -1
      ? [...acc, [firstIndex, index]]
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- The index must exist according to the findIndex above
        acc.with(accIndex, [...acc[accIndex]!, index])
  }, [])

/**
 * Checks if all elements in the array are the same. An empty array is considered to satisfy this condition.
 *
 * @param arr The array to check.
 * @param equalityCheck An optional function to determine if two elements are considered the same. Defaults to strict shallow equality.
 * @returns `true` if all elements in the array are the same, otherwise `false`.
 */
export const allSame = <T>(
  arr: readonly T[],
  equalityCheck: (a: T, b: T) => boolean = (a, b) => a === b,
): boolean => (isNotEmpty(arr) ? arr.every(item => equalityCheck(item, arr[0])) : true)

/**
 * Finds the first element in the array that satisfies the provided function and returns its mapped value. If no such element is found, it returns `undefined`.
 *
 * @param arr The array to search through.
 * @param fn A function that takes an element and its index, and returns a mapped value or `undefined`.
 * @returns The mapped value of the first element that satisfies the function, or `undefined` if no such element is found.
 */
export const findMap = <T, U>(
  arr: readonly T[],
  fn: (value: T, index: number) => NonNullable<U> | undefined,
): NonNullable<U> | undefined => {
  for (let i = 0; i < arr.length; i++) {
    const result = fn(arr[i]!, i)
    if (result !== undefined) {
      return result
    }
  }
  return undefined
}
