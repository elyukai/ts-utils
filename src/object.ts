/**
 * Utility functions for objects.
 * @module
 */

/**
 * Maps all own properties of an object to a new object. Returning `undefined`
 * from the mapping function will omit the property from the result.
 */
export const mapObject = <T extends object, U>(
  object: T,
  map: (value: T[keyof T], key: keyof T) => U | undefined,
): { [key in keyof T]: Exclude<U, undefined> } => {
  const result: { [key in keyof T]: Exclude<U, undefined> } = {} as never

  for (const key in object) {
    if (Object.hasOwn(object, key)) {
      const newValue = map(object[key], key)
      if (newValue !== undefined) {
        result[key] = newValue as Exclude<U, undefined>
      }
    }
  }

  return result
}

/**
 * Sorts the keys of an object based on the order of the provided keys array.
 *
 * Keys not present in the keys array will be placed at the end in their original order.
 */
export const sortObjectKeysByIndex = <T extends Record<string, unknown>>(
  obj: T,
  keys: Extract<keyof T, string>[],
): T =>
  Object.fromEntries([
    ...keys.flatMap(key => (obj[key] === undefined ? [] : [[key, obj[key]] as [string, unknown]])),
    ...Object.entries(obj).filter(([key]) => !keys.includes(key as Extract<keyof T, string>)),
  ]) as T

/**
 * Sorts the keys of an object using the provided comparison function.
 *
 * By default, it sorts the keys in ascending lexicographical order.
 */
export const sortObjectKeys = <T extends Record<string, unknown>>(
  obj: T,
  fn: (a: Extract<keyof T, string>, b: Extract<keyof T, string>) => number = (a, b) =>
    a.localeCompare(b),
): T =>
  Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) =>
      fn(keyA as Extract<keyof T, string>, keyB as Extract<keyof T, string>),
    ),
  ) as T

/**
 * Merges two objects. In case of key conflicts, the `solveConflict` function
 * is used to determine the value for the conflicting key.
 */
export const mergeObjects = <T, K extends string = string>(
  obj1: Partial<Record<K, T>>,
  obj2: Partial<Record<K, T>>,
  solveConflict: (a: T, b: T) => T,
): Partial<Record<K, T>> =>
  Object.entries<T>(obj2 as Record<K, T>).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: Object.hasOwn(acc, key) ? solveConflict(acc[key as K] as T, value) : value,
    }),
    obj1,
  )

/**
 * Keeps only the given keys in an object.
 */
export const onlyKeys = <T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key as K))) as Pick<T, K>

/**
 * Determines whether an object has a property with the specified name.
 *
 * Provides a type guard to assert the presence of the key, in contrast to the native `Object.hasOwn`.
 */
export const hasKey = <T extends object, K extends PropertyKey>(
  obj: T,
  key: K,
): obj is T & Record<K, unknown> => Object.hasOwn(obj, key)

/**
 * Omits all keys with `undefined` values from an object.
 */
export const omitUndefinedKeys = <T extends object>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as T

/**
 * Omits the given keys from an object.
 */
export const omitKeys = <T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key as K))) as Omit<T, K>
