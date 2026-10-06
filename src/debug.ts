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
 * Logs the result of applying a function to a value and returns the original value.
 */
export const traceWith = <T>(value: T, fn: (value: T) => unknown): T => {
  console.log(fn(value))
  return value
}

/**
 * Logs a message to the console if the predicate applies to the value and returns the provided value.
 */
export const traceCond = <T>(value: T, pred: (value: T) => boolean): T => {
  if (pred(value)) {
    console.log(value)
  }

  return value
}

/**
 * Logs the result of applying a function to a value and returns the value.
 */
export const traceIdCond = <T>(value: T, pred: (value: T) => boolean): T => {
  if (pred(value)) {
    console.log(value)
  }

  return value
}

/**
 * Logs the result of applying a function to a value if the predicate applies to the original value and returns the original value.
 */
export const traceWithCond = <T>(
  value: T,
  fn: (value: T) => unknown,
  pred: (value: T) => boolean,
): T => {
  if (pred(value)) {
    console.log(fn(value))
  }

  return value
}
