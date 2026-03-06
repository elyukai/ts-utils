/**
 * Utility functions for transforming arrays.
 * @module
 */

import { isNotEmpty } from "./nonEmpty.ts"

/**
 * Returns a new array with the given value interspersed between each element of the given array. An empty array is returned if the given array is empty.
 * @param arr The array to intersperse.
 * @param value The value to intersperse between each element of the array.
 * @returns A new array with the given value interspersed between each element of the given array.
 */
export const intersperse = <T>(arr: T[], value: T): T[] =>
  !isNotEmpty(arr) ? [] : arr.slice(1).reduce<T[]>((acc, elem) => [...acc, value, elem], [arr[0]])

/**
 * Returns a new array with the given values intercalated between each element of the given array. An empty array is returned if the given array is empty.
 * @param arr The array to intercalate.
 * @param values The values to intercalate between each element of the array.
 * @returns A new array with the given values intercalated between each element of the given array.
 */
export const intercalate = <T>(arr: T[][], values: T[]): T[] =>
  !isNotEmpty(arr)
    ? []
    : arr.slice(1).reduce<T[]>((acc, elem) => [...acc, ...values, ...elem], arr[0])

/**
 * Returns the possibilities of all the combinations of nested array values.
 *
 * @example
 *
 * flatCombine([["a", "b"], ["c"]]) // [["a", "c"], ["b", "c"]]
 * flatCombine([["a", "b"], ["c", "d"]]) // [["a", "c"], ["b", "c"], ["a", "d"], ["b", "d"]]
 */
export const flatCombine = <T>(arr: T[][]): T[][] =>
  arr.length === 0
    ? []
    : arr.slice(1).reduce<T[][]>(
        (acc, elem) => elem.flatMap(elemInner => acc.map(accElem => [...accElem, elemInner])),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it is checked before if the array is empty
        arr[0]!.map(elem => [elem]),
      )
