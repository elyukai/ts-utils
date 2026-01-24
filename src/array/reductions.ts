/**
 * Utility functions for building a single value from an array.
 * @module
 */

import { unique } from "./filters.js"

/**
 * Reduces an array, but stops as soon as the predicate returns `true` for an
 * accumulated value (including the initial value) and returns the last
 * accumulated value.
 * @param arr The array to reduce.
 * @param fn The function to apply to each element in the array.
 * @param pred The predicate to apply to the initial value and to every result
 * of a call to `fn`, where if it returns `true`, the reduction stops.
 * @param initial The initial value.
 */
export const reduceWhile = <T, U>(
  arr: T[],
  fn: (acc: U, value: T, index: number) => U,
  pred: (acc: U) => boolean,
  initial: U,
): U => {
  let acc = initial
  let index = 0
  while (index < arr.length && !pred(acc)) {
    acc = fn(acc, arr[index] as T, index)
    index++
  }
  return acc
}

/**
 * Returns the sum of all numbers in the given array.
 */
export const sum = (arr: number[]): number =>
  arr.reduce((acc, value) => acc + value, 0)

/**
 * Returns the sum of values returned by applying the given function to each
 * element in the array.
 */
export const sumWith = <T>(
  arr: T[],
  fn: (value: T, index: number) => number,
): number => arr.reduce((acc, value, index) => acc + fn(value, index), 0)

/**
 * Counts the number of elements in an array that satisfy the given predicate.
 */
export const count = <T>(
  arr: T[],
  predicate: (value: T, index: number) => boolean,
): number => sumWith(arr, (value, index) => (predicate(value, index) ? 1 : 0))

/**
 * Counts the number of elements the function returns the same value for and
 * returns the count for all returned values as an object.
 */
export const countBy = <T, K extends string | number | symbol>(
  arr: T[],
  fn: (value: T, index: number) => K,
): Partial<Record<K, number>> =>
  arr.reduce<Partial<Record<K, number>>>((acc, value, index) => {
    const key = fn(value, index)
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

/**
 * Counts the number of elements the function returns the same values for and
 * returns the count for all returned values as an object.
 */
export const countByMany = <T, K extends string | number | symbol>(
  arr: T[],
  fn: (value: T, index: number) => K[],
): Partial<Record<K, number>> =>
  arr.reduce<Partial<Record<K, number>>>((acc, value, index) => {
    const keys = fn(value, index)
    unique(keys).forEach((key) => {
      acc[key] = (acc[key] ?? 0) + 1
    })
    return acc
  }, {})

/**
 * Returns `true` if the array contains at least `minCount` elements that
 * satisfy the given predicate, `false` otherwise.
 */
export const someCount = <T>(
  arr: T[],
  predicate: (value: T) => boolean,
  minCount: number,
): boolean =>
  reduceWhile(
    arr,
    (acc, value) => (predicate(value) ? acc + 1 : acc),
    (acc) => acc >= minCount,
    0,
  ) >= minCount
