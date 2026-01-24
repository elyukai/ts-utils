/**
 * Introduces helper functions for a native dictionary, which is an index object.
 */

import type { AnyNonNullish } from "../nullable.js"
import { omitKeys } from "../object.js"

/**
 * An alias for a native dictionary.
 */
export type Dictionary<T extends AnyNonNullish | null> = Readonly<
  Record<string, T>
>

/**
 * An empty dictionary.
 */
export const empty: Dictionary<never> = {}

/**
 * Constructs a dictionary from an array of key-value pairs.
 */
export const fromEntries = <T extends AnyNonNullish | null>(
  entries: [string, T][],
): Dictionary<T> => Object.fromEntries(entries)

/**
 * Returns the value associated with the given key, or `undefined` if the key does not exist.
 */
export const get = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
  key: string,
): T | undefined => dict[key]

/**
 * Returns the value associated with the given key mapped through the given function, or `undefined` if the key does not exist.
 */
export const getMap = <T extends AnyNonNullish | null, U>(
  dict: Dictionary<T>,
  key: string,
  mapFn: (value: T) => U,
): U | undefined => {
  const value = get(dict, key)
  return value === undefined ? undefined : mapFn(value)
}

/**
 * Checks if the dictionary has the given key.
 */
export const has = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
  key: string,
): boolean => Object.prototype.hasOwnProperty.call(dict, key)

/**
 * Sets the given key to the given value.
 *
 * If the key already exists, its value will be overwritten.
 */
export const set = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
  key: string,
  value: T,
): Dictionary<T> => ({ ...dict, [key]: value })

/**
 * Removes the given key from the dictionary.
 *
 * If the key does not exist, the same dictionary instance is returned.
 */
export const remove = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
  key: string,
): Dictionary<T> => {
  if (has(dict, key)) {
    return omitKeys(dict, key)
  } else {
    return dict
  }
}

/**
 * Returns the number of entries in the dictionary.
 */
export const size = (dict: Dictionary<AnyNonNullish | null>): number =>
  Object.keys(dict).length

/**
 * Returns an array of key-value pairs in the dictionary.
 */
export const entries = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
): [string, T][] => Object.entries(dict)

/**
 * Returns an array of values in the dictionary.
 */
export const values = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
): T[] => Object.values(dict)

/**
 * Returns an array of keys in the dictionary.
 */
export const keys = (dict: Dictionary<AnyNonNullish | null>): string[] =>
  Object.keys(dict)

/**
 * Calls the given function for each key-value pair in the dictionary.
 */
export const forEach = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
  fn: (value: T, key: string) => void,
): void => {
  for (const [key, value] of Object.entries(dict)) {
    fn(value, key)
  }
}

/**
 * Calls the given async function for each key-value pair in the dictionary.
 *
 * The calls are made sequentially.
 */
export const forEachAsync = async <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
  fn: (value: T, key: string) => Promise<void>,
): Promise<void> => {
  for (const [key, value] of Object.entries(dict)) {
    await fn(value, key)
  }
}

/**
 * Create, modify, or remove the value for the given key based on its current value.
 *
 * The value passed to `modifyFn` will be `undefined` if the key does not exist.
 * If the `modifyFn` returns `undefined`, the key will be removed from the dictionary.
 * Otherwise, the key will be set to the new value returned by `modifyFn`.
 */
export const modify = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
  key: string,
  modifyFn: (currentValue: T | undefined) => T | undefined,
): Dictionary<T> => {
  const currentValue = get(dict, key)
  const newValue = modifyFn(currentValue)

  if (newValue === undefined) {
    return remove(dict, key)
  } else {
    return set(dict, key, newValue)
  }
}

/**
 * Returns the first value that matches the given predicate, or `undefined` if no such value exists.
 */
export const find: {
  /**
   * Returns the first value that matches the given predicate, or `undefined` if no such value exists.
   */
  <T extends AnyNonNullish | null, U extends T>(
    dict: Dictionary<T>,
    predicate: (value: T, key: string) => value is U,
  ): U | undefined
  /**
   * Returns the first value that matches the given predicate, or `undefined` if no such value exists.
   */
  <T extends AnyNonNullish | null>(
    dict: Dictionary<T>,
    predicate: (value: T, key: string) => boolean,
  ): T | undefined
} = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
  predicate: (value: T, key: string) => boolean,
): T | undefined => findEntry(dict, predicate)?.[1]

/**
 * Returns the first key that matches the given predicate, or `undefined` if no such key exists.
 */
export const findKey = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
  predicate: (value: T, key: string) => boolean,
): string | undefined => findEntry(dict, predicate)?.[0]

/**
 * Returns the first key-value pair that matches the given predicate, or `undefined` if no such key-value pair exists.
 */
export const findEntry: {
  /**
   * Returns the first key-value pair that matches the given predicate, or `undefined` if no such key-value pair exists.
   */
  <T extends AnyNonNullish | null, U extends T>(
    dict: Dictionary<T>,
    predicate: (value: T, key: string) => value is U,
  ): [key: string, value: U] | undefined
  /**
   * Returns the first key-value pair that matches the given predicate, or `undefined` if no such key-value pair exists.
   */
  <T extends AnyNonNullish | null>(
    dict: Dictionary<T>,
    predicate: (value: T, key: string) => boolean,
  ): [key: string, value: T] | undefined
} = <T extends AnyNonNullish | null>(
  dict: Dictionary<T>,
  predicate: (value: T, key: string) => boolean,
): [key: string, value: T] | undefined => {
  for (const [key, value] of Object.entries(dict)) {
    if (predicate(value, key)) {
      return [key, value]
    }
  }

  return undefined
}

/**
 * Applies the given mapping function to each key-value pair in the dictionary and returns the first non-`undefined` result, or `undefined` if no such result exists.
 */
export const mapFirst = <T extends AnyNonNullish | null, U>(
  dict: Dictionary<T>,
  mapFn: (value: T, key: string) => U | undefined,
): U | undefined => {
  for (const [key, value] of Object.entries(dict)) {
    const mapped = mapFn(value, key)
    if (mapped !== undefined) {
      return mapped
    }
  }

  return undefined
}

/**
 * Applies a function to every key-value pair in the dictionary.
 */
export const map = <
  T extends AnyNonNullish | null,
  U extends AnyNonNullish | null,
>(
  dict: Dictionary<T>,
  mapFn: (value: T, key: string) => U,
): Dictionary<U> => {
  const newRecord: Record<string, U> = {}
  for (const [key, value] of Object.entries(dict)) {
    newRecord[key] = mapFn(value, key)
  }
  return newRecord
}

/**
 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 */
export const reduce = <T extends AnyNonNullish | null, U>(
  dict: Dictionary<T>,
  reducer: (acc: U, value: T, key: string) => U,
  initialValue: U,
): U =>
  Object.entries(dict).reduce(
    (acc, [key, item]) => reducer(acc, item, key),
    initialValue,
  )
