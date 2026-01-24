/**
 * Utility functions for enhancing type-safety.
 * @module
 */

/**
 * This function is used to make sure that the `switch` is exhaustive. Place it
 * in the `default` case of the `switch`.
 *
 * Optionally, you can pass a custom error message.
 * @param _x - The value that is used in the `switch`.
 * @param [msg] - A custom error message.
 * @example
 * const aorb = (x: "a" | "b") => {
 *   switch (x) {
 *     case "a": return 1
 *     case "b": return 2
 *     default: return assertExhaustive(x)
 *   }
 * }
 */
export function assertExhaustive(
  _x: never,
  msg = "The switch is not exhaustive.",
): never {
  throw new Error(msg)
}

/**
 * Tries to execute a function, returning a default value if an error is thrown.
 * @param f The function to execute.
 * @param defaultValue The default value to return if an error is thrown.
 * @returns The result of the function if successful, or the default value.
 */
export const trySafe: {
  /**
   * Tries to execute a function, returning `undefined` if an error is thrown.
   * @param f The function to execute.
   * @returns The result of the function if successful, or `undefined`.
   */
  <T>(f: () => T): T | undefined
  /**
   * Tries to execute a function, returning a default value if an error is thrown.
   * @param f The function to execute.
   * @param defaultValue The default value to return if an error is thrown.
   * @returns The result of the function if successful, or the default value.
   */
  <T>(f: () => T, defaultValue: T): T
} = <T>(f: () => T, defaultValue?: T): T => {
  try {
    return f()
  } catch {
    return defaultValue as T
  }
}
