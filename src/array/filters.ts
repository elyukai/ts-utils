/**
 * Filters out duplicate values from an array. Objects are not supported, since
 * they don’t provide value equality semantics.
 */
export const unique = <
  T extends number | boolean | string | symbol | null | undefined,
>(
  arr: T[],
): T[] => Array.from(new Set(arr))

/**
 * Checks if there are any duplicate elements in the array.
 */
export const anySame = <T>(
  arr: T[],
  equalityCheck: (a: T, b: T) => boolean = (a, b) => a === b,
): boolean =>
  arr.some(
    (item, index) =>
      arr.findIndex((other) => equalityCheck(item, other)) !== index,
  )

/**
 * Checks if there are any duplicate elements in the array and returns an array
 * of found duplicates where the values are the indices of these values.
 */
export const anySameIndices = <T>(
  arr: T[],
  equalityCheck: (a: T, b: T) => boolean = (a, b) => a === b,
): number[][] =>
  arr.reduce((acc: number[][], item, index) => {
    const firstIndex = arr.findIndex((other) => equalityCheck(item, other))
    if (firstIndex === index) {
      return acc
    }
    const accIndex = acc.findIndex((accElem) => accElem[0] === firstIndex)
    return accIndex === -1
      ? [...acc, [firstIndex, index]]
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- The index must exist according to the findIndex above
        acc.with(accIndex, [...acc[accIndex]!, index])
  }, [])
