/**
 *´Utility function for debugging purposes.
 * @module
 */

/**
 * Logs a message to the console and returns the provided value.
 */
export const trace = <T>(value: T, message: unknown): T => {
  console.log(message)
  return value
}

/**
 * Logs a value and returns it afterwards.
 */
export const traceId = <T>(value: T): T => {
  console.log(value)
  return value
}

/**
 * Logs the result of applying a function to a value and returns the value.
 */
export const traceWith = <T>(value: T, fn: (value: T) => unknown): T => {
  console.log(fn(value))
  return value
}
