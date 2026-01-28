/**
 * Introduces a Dictionary class that represents an immutable mapping from strings to values.
 * @module
 */

import type { AnyNonNullish } from "./nullable.js"
import { omitKeys, omitUndefinedKeys } from "./object.js"

/**
 * An immutable dictionary mapping strings to values.
 */
export class Dictionary<
  T extends AnyNonNullish | null,
  K extends string = string,
> {
  private record: Readonly<Partial<Record<K, T>>>

  /**
   * Creates a new dictionary from an indexed object.
   */
  constructor(record: Partial<Record<K, T>>) {
    this.record = omitUndefinedKeys(record)
  }

  /**
   * An empty dictionary.
   */
  static empty: Dictionary<never, never> = new Dictionary<never, never>({})

  /**
   * Constructs a dictionary from an array of key-value pairs.
   */
  static fromEntries<T extends AnyNonNullish | null, K extends string = string>(
    entries: [K, T][],
  ): Dictionary<T, K> {
    return new Dictionary(Object.fromEntries(entries) as Partial<Record<K, T>>)
  }

  /**
   * Returns the value associated with the given key, or `undefined` if the key does not exist.
   */
  get(key: K): T | undefined {
    return this.record[key]
  }

  /**
   * Returns the value associated with the given key mapped through the given function, or `undefined` if the key does not exist.
   */
  getMap<U>(key: K, mapFn: (value: T) => U): U | undefined {
    const value = this.get(key)
    return value === undefined ? undefined : mapFn(value)
  }

  /**
   * Checks if the dictionary has the given key.
   */
  has(key: K): boolean {
    return Object.prototype.hasOwnProperty.call(this.record, key)
  }

  /**
   * Sets the given key to the given value.
   *
   * If the key already exists, its value will be overwritten.
   */
  set(key: K, value: T): Dictionary<T, K> {
    return new Dictionary<T, K>({ ...this.record, [key]: value })
  }

  /**
   * Removes the given key from the dictionary.
   *hs
   * If the key does not exist, the same dictionary instance is returned.
   */
  remove(key: K): Dictionary<T, K> {
    if (this.has(key)) {
      return new Dictionary<T, K>(
        omitKeys(this.record, key) as Partial<Record<K, T>>,
      )
    } else {
      return this
    }
  }

  /**
   * The number of entries in the dictionary.
   */
  get size(): number {
    return this.keys().length
  }

  /**
   * Returns an array of key-value pairs in the dictionary.
   */
  entries(): [K, T][] {
    return Object.entries(this.record) as [K, T][]
  }

  /**
   * Returns an array of values in the dictionary.
   */
  values(): T[] {
    return Object.values(this.record as Record<K, T>)
  }

  /**
   * Returns an array of keys in the dictionary.
   */
  keys(): K[] {
    return Object.keys(this.record) as K[]
  }

  /**
   * Calls the given function for each key-value pair in the dictionary.
   */
  forEach(fn: (value: T, key: K) => void): void {
    for (const [key, value] of this.entries()) {
      fn(value, key)
    }
  }

  /**
   * Calls the given async function for each key-value pair in the dictionary.
   *
   * The calls are made sequentially.
   */
  async forEachAsync(fn: (value: T, key: K) => Promise<void>): Promise<void> {
    for (const [key, value] of this.entries()) {
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
  modify(
    key: K,
    modifyFn: (currentValue: T | undefined) => T | undefined,
  ): Dictionary<T, K> {
    const currentValue = this.get(key)
    const newValue = modifyFn(currentValue)

    if (newValue === undefined) {
      return this.remove(key)
    } else {
      return this.set(key, newValue)
    }
  }

  /**
   * Returns the first value that matches the given predicate, or `undefined` if
   * no such value exists.
   */
  find<U extends T>(predicate: (value: T, key: K) => value is U): U | undefined
  /**
   * Returns the first value that matches the given predicate, or `undefined` if
   * no such value exists.
   */
  find(predicate: (value: T, key: K) => boolean): T | undefined
  /**
   * Returns the first value that matches the given predicate, or `undefined` if
   * no such value exists.
   */
  find(predicate: (value: T, key: K) => boolean): T | undefined {
    return this.findEntry(predicate)?.[1]
  }

  /**
   * Returns the first key that matches the given predicate, or `undefined` if no such key exists.
   */
  findKey(predicate: (value: T, key: K) => boolean): string | undefined {
    return this.findEntry(predicate)?.[0]
  }

  /**
   * Returns the first key-value pair that matches the given predicate, or `undefined` if no such key-value pair exists.
   */
  findEntry<U extends T>(
    predicate: (value: T, key: K) => value is U,
  ): [key: K, value: U] | undefined
  /**
   * Returns the first key-value pair that matches the given predicate, or `undefined` if no such key-value pair exists.
   */
  findEntry(
    predicate: (value: T, key: K) => boolean,
  ): [key: K, value: T] | undefined
  /**
   * Returns the first key-value pair that matches the given predicate, or `undefined` if no such key-value pair exists.
   */
  findEntry(
    predicate: (value: T, key: K) => boolean,
  ): [key: K, value: T] | undefined {
    for (const [key, value] of this.entries()) {
      if (predicate(value, key)) {
        return [key, value]
      }
    }

    return undefined
  }

  /**
   * Applies the given mapping function to each key-value pair in the dictionary and returns the first non-`undefined` result, or `undefined` if no such result exists.
   */
  mapFirst<U extends AnyNonNullish | null>(
    mapFn: (value: T, key: K) => U | undefined,
  ): U | undefined {
    for (const [key, value] of this.entries()) {
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
  map<U extends AnyNonNullish | null>(
    mapFn: (value: T, key: K) => U,
  ): Dictionary<U> {
    const newRecord: Partial<Record<K, U>> = {}
    for (const [key, value] of this.entries()) {
      newRecord[key] = mapFn(value, key)
    }
    return new Dictionary(newRecord)
  }

  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   */
  reduce<U>(reducer: (acc: U, value: T, key: string) => U, initialValue: U): U {
    return this.entries().reduce(
      (acc, [key, item]) => reducer(acc, item, key),
      initialValue,
    )
  }

  /**
   * Converts the dictionary to a plain object.
   *
   * This is automatically called when using `JSON.stringify`.
   */
  toJSON(): Partial<Record<K, T>> {
    return { ...this.record }
  }
}
