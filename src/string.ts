/**
 * Utility functions for strings.
 * @module
 */

/**
 * Checks if a value is a non-empty string.
 */
export const isNonEmptyString = (
  value: string | null | undefined,
): value is string => typeof value === "string" && value.length > 0

const letterOrDigit = /[a-zA-Z0-9]/
const uppercase = /[A-Z]/
const lowerCaseOrDigit = /[a-z0-9]/
const separator = /[^a-z0-9]/

const lastChar = (str: string) => str[str.length - 1]
const lastElement = <T>(arr: T[]) => arr[arr.length - 1]

const isAllUppercase = (str: string) => str === str.toUpperCase()

/**
 * Splits a string into its constituent parts based on casing and separators.
 */
export const splitStringParts = (str: string): string[] =>
  [...new Intl.Segmenter().segment(str)].reduce(
    (acc: string[], segment, i, strArr) => {
      const char = segment.segment

      if (acc.length === 0) {
        return letterOrDigit.test(char) ? [char] : acc
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastPart = lastElement(acc)!

      if (uppercase.test(char)) {
        const lastCharOfLastPart = lastChar(lastPart)
        const nextSegment = strArr[i + 1]
        const nextChar = nextSegment?.segment

        if (
          lastCharOfLastPart === undefined ||
          (uppercase.test(lastCharOfLastPart) &&
            (nextChar === undefined || separator.test(nextChar)))
        ) {
          return [...acc.slice(0, -1), lastPart + char]
        } else {
          return [...acc, char]
        }
      }

      if (lowerCaseOrDigit.test(char)) {
        return [...acc.slice(0, -1), lastPart + char]
      }

      if (lastPart === "") {
        return acc
      } else {
        return [...acc, ""]
      }
    },
    [],
  )

/**
 * Converts a string to PascalCase.
 */
export const toPascalCase = (str: string): string =>
  splitStringParts(isAllUppercase(str) ? str.toLowerCase() : str)
    .map((part) =>
      isAllUppercase(part)
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join("")

/**
 * Converts a string to camelCase.
 */
export const toCamelCase = (str: string): string =>
  splitStringParts(isAllUppercase(str) ? str.toLowerCase() : str)
    .map((part, i) =>
      i === 0
        ? part.toLowerCase()
        : isAllUppercase(part)
          ? part
          : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join("")

/**
 * Converts a string to kebab-case.
 */
export const toKebabCase = (str: string): string =>
  splitStringParts(str)
    .map((part) => part.toLowerCase())
    .join("-")

/**
 * Converts a string to snake_case.
 */
export const toSnakeCase = (str: string): string =>
  splitStringParts(str)
    .map((part) => part.toLowerCase())
    .join("_")

/**
 * Converts a string to Title Case.
 */
export const toTitleCase = (str: string): string =>
  splitStringParts(isAllUppercase(str) ? str.toLowerCase() : str)
    .map((part) =>
      isAllUppercase(part)
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join(" ")

/**
 * Finds the longest common prefix among the provided strings.
 */
export const commonPrefix = (...strs: string[]): string => {
  if (strs.length === 0) {
    return ""
  }

  return strs.reduce((accPrefix, str) => {
    const indexOfDifference = Array.from(accPrefix).findIndex(
      (char, i) => str[i] !== char,
    )
    return indexOfDifference === -1
      ? accPrefix
      : accPrefix.slice(0, indexOfDifference)
  })
}
