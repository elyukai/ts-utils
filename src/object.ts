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
export const sortObjectKeysByIndex = (
  obj: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> =>
  Object.fromEntries([
    ...keys.flatMap((key) =>
      obj[key] === undefined ? [] : [[key, obj[key]] as [string, unknown]],
    ),
    ...Object.entries(obj).filter(([key]) => !keys.includes(key)),
  ])

/**
 * Sorts the keys of an object using the provided comparison function.
 *
 * By default, it sorts the keys in ascending lexicographical order.
 */
export const sortObjectKeys = (
  obj: Record<string, unknown>,
  fn: (a: string, b: string) => number = (a, b) => a.localeCompare(b),
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) => fn(keyA, keyB)),
  )

/**
 * Merges two objects. In case of key conflicts, the `solveConflict` function
 * is used to determine the value for the conflicting key.
 */
export const mergeObjects = <T>(
  obj1: Record<string, T>,
  obj2: Record<string, T>,
  solveConflict: (a: T, b: T) => T,
): Record<string, T> =>
  Object.entries(obj2).reduce(
    (acc, [key, value]) => ({
      ...acc,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      [key]: Object.hasOwn(acc, key) ? solveConflict(acc[key]!, value) : value,
    }),
    obj1,
  )

/**
 * Keeps only the given keys in an object.
 */
export const onlyKeys = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key as K)),
  ) as Pick<T, K>

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
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as T

/**
 * Omits the given keys from an object.
 */
export const omitKeys = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>
