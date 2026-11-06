/**
 * Utility functions for building a single value from an array.
 * @module
 */

import { unique } from "./filters.js"

export interface ReducableIterable<T> {
  [Symbol.iterator](): IteratorObject<T>
  reduce?<U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U,
    initialValue: U,
  ): U
}

const _reduceIterable = <T, U>(
  iterable: ReducableIterable<T>,
  callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U,
  initialValue: U,
): U => {
  if (iterable.reduce) {
    return iterable.reduce(callbackfn, initialValue)
  }

  let acc = initialValue
  let index = 0
  for (const value of iterable) {
    acc = callbackfn(acc, value, index)
    index++
  }
  return acc
}

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
  arr: Iterable<T>,
  fn: (acc: U, value: T, index: number) => U,
  pred: (acc: U) => boolean,
  initial: U,
): U => {
  let acc = initial
  let index = 0
  for (const value of arr) {
    if (pred(acc)) {
      break
    }
    acc = fn(acc, value, index)
    index++
  }
  return acc
}

/**
 * Returns the sum of all numbers in the given array.
 */
export const sum = (arr: ReducableIterable<number>): number =>
  _reduceIterable(arr, (acc, value) => acc + value, 0)

/**
 * Returns the sum of values returned by applying the given function to each
 * element in the array.
 */
export const sumWith = <T>(
  arr: ReducableIterable<T>,
  fn: (value: T, index: number) => number,
): number => _reduceIterable(arr, (acc, value, index) => acc + fn(value, index), 0)

/**
 * Counts the number of elements in an array that satisfy the given predicate.
 */
export const count = <T>(
  arr: ReducableIterable<T>,
  predicate: (value: T, index: number) => boolean,
): number => sumWith(arr, (value, index) => (predicate(value, index) ? 1 : 0))

/**
 * Counts the number of elements the function returns the same value for and
 * returns the count for all returned values as an object.
 */
export const countBy = <T, K extends string | number | symbol>(
  arr: ReducableIterable<T>,
  fn: (value: T, index: number) => K,
): Partial<Record<K, number>> =>
  _reduceIterable<T, Partial<Record<K, number>>>(
    arr,
    (acc, value, index) => {
      const key = fn(value, index)
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    },
    {},
  )

const isReadonlyArray = <T>(value: ReadonlyArray<T> | ReadonlySet<T>): value is ReadonlyArray<T> =>
  Array.isArray(value)

/**
 * Counts the number of elements the function returns the same values for and
 * returns the count for all returned values as an object.
 */
export const countByMany = <T, K extends string | number | symbol>(
  arr: ReducableIterable<T>,
  fn: (value: T, index: number) => ReadonlyArray<K> | ReadonlySet<K>,
): Partial<Record<K, number>> =>
  _reduceIterable<T, Partial<Record<K, number>>>(
    arr,
    (acc, value, index) => {
      const keys = fn(value, index)

      for (const key of isReadonlyArray(keys) ? unique(keys) : keys) {
        acc[key] = (acc[key] ?? 0) + 1
      }

      return acc
    },
    {},
  )

/**
 * Returns `true` if the array contains at least `minCount` elements that
 * satisfy the given predicate, `false` otherwise.
 */
export const someCount = <T>(
  arr: Iterable<T>,
  predicate: (value: T) => boolean,
  minCount: number,
): boolean =>
  reduceWhile(
    arr,
    (acc, value) => (predicate(value) ? acc + 1 : acc),
    acc => acc >= minCount,
    0,
  ) >= minCount
