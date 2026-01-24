/**
 * Utility functions for generating new arrays.
 * @module
 */

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
        (acc, elem) =>
          elem.flatMap((elemInner) =>
            acc.map((accElem) => [...accElem, elemInner]),
          ),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it is checked before if the array is empty
        arr[0]!.map((elem) => [elem]),
      )
