/**
 * Checks if strings match certain regular expressions.
 * @module
 */

const naturalNumberPattern = /^(?:0|[1-9][0-9]*)$/u
const integerPattern = /^(?:0|-?[1-9][0-9]*)$/u
const floatPattern = /^(?:(?:0|-?[1-9][0-9]*)(?:[.,][0-9]+)?)$/u

/**
 * Checks if the provided string is a string representation of a natural number.
 * @param test The string to test.
 */
export const isNaturalNumber = (test: string): boolean =>
  naturalNumberPattern.test(test)

/**
 * Checks if the provided string is a string representation of an integer.
 * @param test The string to test.
 */
export const isInteger = (test: string): boolean => integerPattern.test(test)

/**
 * Checks if the provided string is a string representation of a floating-point
 * number. Both `.` and `,` are accepted as decimal separators.
 * @param test The string to test.
 */
export const isFloat = (test: string): boolean => floatPattern.test(test)

/**
 * Checks if the provided string either is an empty string or passes the given
 * test function.
 * @param check The test function to apply if the string is not empty.
 * @param test The string to test.
 */
export const isEmptyOr = (
  check: (test: string) => boolean,
  test: string,
): boolean => test === "" || check(test)

/**
 * Checks if the provided string is a valid URL.
 * @param test The string to test.
 */
export const isUrl = (test: string): boolean => {
  try {
    return typeof new URL(test) === "object"
  } catch {
    return false
  }
}
