/**
 * Introduces a Dictionary class that represents an immutable mapping from strings to values.
 * @module
 */

import type { AnyNonNullish } from "./nullable.js"
import { omitKeys } from "./object.js"

/**
 * An immutable dictionary mapping strings to values.
 */
export class Dictionary<T extends AnyNonNullish | null> {
  private record: Readonly<Record<string, T>>

  /**
   * Creates a new dictionary from an indexed object.
   */
  constructor(record: Record<string, T>) {
    this.record = record
  }

  /**
   * An empty dictionary.
   */
  static empty: Dictionary<never> = new Dictionary<never>({})

  /**
   * Constructs a dictionary from an array of key-value pairs.
   */
  static fromEntries<T extends AnyNonNullish | null>(
    entries: [string, T][],
  ): Dictionary<T> {
    return new Dictionary(Object.fromEntries(entries))
  }

  /**
   * Returns the value associated with the given key, or `undefined` if the key does not exist.
   */
  get(key: string): T | undefined {
    return this.record[key]
  }

  /**
   * Returns the value associated with the given key mapped through the given function, or `undefined` if the key does not exist.
   */
  getMap<U>(key: string, mapFn: (value: T) => U): U | undefined {
    const value = this.get(key)
    return value === undefined ? undefined : mapFn(value)
  }

  /**
   * Checks if the dictionary has the given key.
   */
  has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.record, key)
  }

  /**
   * Sets the given key to the given value.
   *
   * If the key already exists, its value will be overwritten.
   */
  set(key: string, value: T): Dictionary<T> {
    return new Dictionary({ ...this.record, [key]: value })
  }

  /**
   * Removes the given key from the dictionary.
   *
   * If the key does not exist, the same dictionary instance is returned.
   */
  remove(key: string): Dictionary<T> {
    if (this.has(key)) {
      return new Dictionary(omitKeys(this.record, key))
    } else {
      return this
    }
  }

  /**
   * The number of entries in the dictionary.
   */
  get size(): number {
    return Object.keys(this.record).length
  }

  /**
   * Returns an array of key-value pairs in the dictionary.
   */
  entries(): [string, T][] {
    return Object.entries(this.record)
  }

  /**
   * Returns an array of values in the dictionary.
   */
  values(): T[] {
    return Object.values(this.record)
  }

  /**
   * Returns an array of keys in the dictionary.
   */
  keys(): string[] {
    return Object.keys(this.record)
  }

  /**
   * Calls the given function for each key-value pair in the dictionary.
   */
  forEach(fn: (value: T, key: string) => void): void {
    for (const [key, value] of Object.entries(this.record)) {
      fn(value, key)
    }
  }

  /**
   * Calls the given async function for each key-value pair in the dictionary.
   *
   * The calls are made sequentially.
   */
  async forEachAsync(
    fn: (value: T, key: string) => Promise<void>,
  ): Promise<void> {
    for (const [key, value] of Object.entries(this.record)) {
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
    key: string,
    modifyFn: (currentValue: T | undefined) => T | undefined,
  ): Dictionary<T> {
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
  find<U extends T>(
    predicate: (value: T, key: string) => value is U,
  ): U | undefined
  /**
   * Returns the first value that matches the given predicate, or `undefined` if
   * no such value exists.
   */
  find(predicate: (value: T, key: string) => boolean): T | undefined
  /**
   * Returns the first value that matches the given predicate, or `undefined` if
   * no such value exists.
   */
  find(predicate: (value: T, key: string) => boolean): T | undefined {
    return this.findEntry(predicate)?.[1]
  }

  /**
   * Returns the first key that matches the given predicate, or `undefined` if no such key exists.
   */
  findKey(predicate: (value: T, key: string) => boolean): string | undefined {
    return this.findEntry(predicate)?.[0]
  }

  /**
   * Returns the first key-value pair that matches the given predicate, or `undefined` if no such key-value pair exists.
   */
  findEntry<U extends T>(
    predicate: (value: T, key: string) => value is U,
  ): [key: string, value: U] | undefined
  /**
   * Returns the first key-value pair that matches the given predicate, or `undefined` if no such key-value pair exists.
   */
  findEntry(
    predicate: (value: T, key: string) => boolean,
  ): [key: string, value: T] | undefined
  /**
   * Returns the first key-value pair that matches the given predicate, or `undefined` if no such key-value pair exists.
   */
  findEntry(
    predicate: (value: T, key: string) => boolean,
  ): [key: string, value: T] | undefined {
    for (const [key, value] of Object.entries(this.record)) {
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
    mapFn: (value: T, key: string) => U | undefined,
  ): U | undefined {
    for (const [key, value] of Object.entries(this.record)) {
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
    mapFn: (value: T, key: string) => U,
  ): Dictionary<U> {
    const newRecord: Record<string, U> = {}
    for (const [key, value] of Object.entries(this.record)) {
      newRecord[key] = mapFn(value, key)
    }
    return new Dictionary(newRecord)
  }

  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   */
  reduce<U>(reducer: (acc: U, value: T, key: string) => U, initialValue: U): U {
    return Object.entries(this.record).reduce(
      (acc, [key, item]) => reducer(acc, item, key),
      initialValue,
    )
  }

  /**
   * Converts the dictionary to a plain object.
   *
   * This is automatically called when using `JSON.stringify`.
   */
  toJSON(): Record<string, T> {
    return { ...this.record }
  }
}
