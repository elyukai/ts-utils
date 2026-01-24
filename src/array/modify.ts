/**
 * Utility functions for modifying arrays.
 * @module
 */

/**
 * Moves an element from one position to another within the array.
 */
export const reorder = <T>(
  arr: T[],
  sourceIndex: number,
  targetIndex: number,
): T[] => {
  if (sourceIndex < 0 || sourceIndex >= arr.length) {
    throw new RangeError(
      `source index ${sourceIndex.toString()} is out of bounds for array of length ${arr.length.toString()}`,
    )
  }

  if (targetIndex < 0 || targetIndex >= arr.length) {
    throw new RangeError(
      `target index ${targetIndex.toString()} is out of bounds for array of length ${arr.length.toString()}`,
    )
  }

  if (sourceIndex === targetIndex) {
    return arr
  }

  if (sourceIndex < targetIndex) {
    return [
      ...arr.slice(0, sourceIndex),
      ...arr.slice(sourceIndex + 1, targetIndex + 1),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      arr[sourceIndex]!,
      ...arr.slice(targetIndex + 1),
    ]
  }

  return [
    ...arr.slice(0, targetIndex),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    arr[sourceIndex]!,
    ...arr.slice(targetIndex, sourceIndex),
    ...arr.slice(sourceIndex + 1),
  ]
}

/**
 * Returns a new array with all elements from the original array except for the
 * given index.
 *
 * This function does not modify the original array.
 *
 * @throws {RangeError} Index is out of bounds.
 */
export const removeAt = <T>(arr: T[], index: number): T[] => {
  if (index < 0 || index >= arr.length) {
    throw new RangeError(
      `index ${index.toString()} is out of bounds for array of length ${arr.length.toString()}`,
    )
  }

  return [...arr.slice(0, index), ...arr.slice(index + 1)]
}

/**
 * Inserts an element at a given position in an array and returns a new array with the result of the operation.
 *
 * This function does not modify the original array. The index given can be a valid index in the current array or the length of the array to append the item at the end.
 *
 * @throws {RangeError} Index is out of bounds.
 */
export const insertAt = <T>(arr: T[], index: number, item: T): T[] => {
  if (index < 0 || index > arr.length) {
    throw new RangeError(
      `index ${index.toString()} is out of bounds for array of length ${arr.length.toString()}`,
    )
  }

  return [...arr.slice(0, index), item, ...arr.slice(index)]
}
