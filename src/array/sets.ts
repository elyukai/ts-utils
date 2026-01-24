import { removeAt } from "./modify.ts"

/**
 * Calculates the difference between two arrays, including duplicated values.
 * @param oldArr - The original array.
 * @param newArr - The new array to compare against.
 * @returns An object containing the added and removed elements.
 */
export const difference = <T>(oldArr: T[], newArr: T[]): ArrayDiffResult<T> =>
  newArr.reduce(
    (acc: ArrayDiffResult<T>, item) => {
      const oldIndex = acc.removed.indexOf(item)
      const newIndex = acc.added.indexOf(item)
      if (oldIndex > -1) {
        return {
          ...acc,
          removed: removeAt(acc.removed, oldIndex),
          added: removeAt(acc.added, newIndex),
        }
      }
      return acc
    },
    { removed: oldArr, added: newArr },
  )

export interface ArrayDiffResult<T> {
  /**
   * Elements in `newArr` that are not in `oldArr`.
   */
  added: T[]

  /**
   * Elements in `oldArr` that are not in `newArr`.
   */
  removed: T[]
}
