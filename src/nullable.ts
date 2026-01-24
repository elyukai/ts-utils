/**
 * Extracts `null` and `undefined` from a type.
 */
export type Nullish<T = null | undefined> = T extends null | undefined
  ? T
  : never

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- source for intentional empty object type
export interface AnyNonNullish {}

/**
 * Checks if a value is `null` or `undefined`.
 */
export const isNullish = <T>(value: T): value is Exclude<T, NonNullable<T>> =>
  value === null || value === undefined

/**
 * Checks if a value is not `null` or `undefined`.
 */
export const isNotNullish = <T>(value: T): value is NonNullable<T> =>
  !isNullish(value)

/**
 * Maps a value to another value if it is not `null` or `undefined`.
 */
export const mapNullable = <T, U>(
  value: T,
  map: (value: NonNullable<T>) => U,
): U | Nullish<T> => (isNotNullish(value) ? map(value) : (value as Nullish<T>))

/**
 * Maps a value to another value if it is not `null` or `undefined`, otherwise
 * returns a default value.
 */
export const mapNullableDefault = <T, U>(
  value: T,
  map: (value: NonNullable<T>) => U,
  defaultValue: U,
): U => (isNotNullish(value) ? map(value) : defaultValue)

/**
 * Returns an array, containing the value if it is not `null` or `undefined`.
 *
 * This can be useful in combination with the spread operator or
 * `Array.prototype.flatMap`.
 * @example
 * nullableToArray(2) // [2]
 * nullableToArray(undefined) // []
 *
 * [...nullableToArray(2)] // [2]
 * [1, ...nullableToArray(2)] // [1, 2]
 * [1, ...nullableToArray(undefined)] // [1]
 */
export const nullableToArray = <T>(value: T): NonNullable<T>[] =>
  isNotNullish(value) ? [value] : []

/**
 * Returns the value if it matches the given predicate, otherwise `undefined`.
 */
export const ensure: {
  /**
   * Returns the value if it matches the given predicate, otherwise `undefined`.
   */
  <T, T1 extends T>(
    value: T,
    predicate: (value: T) => value is T1,
  ): T1 | undefined
  /**
   * Returns the value if it matches the given predicate, otherwise `undefined`.
   */
  <T>(value: T, predicate: (value: T) => boolean): T | undefined
} = <T>(value: T, predicate: (value: T) => boolean): T | undefined =>
  predicate(value) ? value : undefined
