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
