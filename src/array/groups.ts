/**
 * Utility functions for grouping values in arrays.
 * @module
 */

import type { Equality } from "../equality.ts"

/**
 * Partitions an array into two arrays based on a predicate.
 * @param arr The array to split.
 * @param predicate The function to apply to each element in the array.
 * @returns An array with two elements, the first one containing all elements
 * that satisfy the predicate, the second one containing all elements that do
 * not satisfy the predicate.
 */
export function partition<T, T1 extends T>(
  arr: T[],
  predicate: (value: T) => value is T1,
): [pos: T1[], neg: T[]]
export function partition<T>(
  arr: T[],
  predicate: (value: T) => boolean,
): [pos: T[], neg: T[]]
/**
 * Partitions an array into two arrays based on a predicate.
 * @param arr The array to split.
 * @param predicate The function to apply to each element in the array.
 * @returns An array with two elements, the first one containing all elements
 * that satisfy the predicate, the second one containing all elements that do
 * not satisfy the predicate.
 */
export function partition<T>(
  arr: T[],
  predicate: (value: T) => boolean,
): [pos: T[], neg: T[]] {
  return arr.reduce<[T[], T[]]>(
    (acc, value) => {
      acc[predicate(value) ? 0 : 1].push(value)
      return acc
    },
    [[], []],
  )
}

/**
 * Returns a new array, where adjacent elements that are considered equal by the
 * given equality function are grouped together. Calling the `flat` method on
 * the result will return the original array.
 */
export const groupBy = <T>(arr: T[], equal: Equality<T>): T[][] =>
  arr.reduce<T[][]>((acc, value) => {
    const lastGroup = acc[acc.length - 1]
    if (lastGroup?.[0] !== undefined && equal(lastGroup[0], value)) {
      lastGroup.push(value)
    } else {
      acc.push([value])
    }
    return acc
  }, [])

/**
 * Splits an array into chunks of a specified size.
 * @param arr The array to be chunked.
 * @param size The size of each chunk.
 * @returns An array of chunks, where each chunk is an array of elements. The last chunk may be smaller than the specified size if there are not enough elements left.
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  if (size <= 0) {
    throw new RangeError(
      `size must be a positive integer, got ${size.toString()}`,
    )
  }

  return arr.reduce((chunks: T[][], item, index) => {
    const chunkIndex = Math.floor(index / size)
    ;(chunks[chunkIndex] ??= []).push(item)
    return chunks
  }, [])
}
