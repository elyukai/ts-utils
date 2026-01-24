/**
 * Utility functions for numbers.
 * @module
 */

/**
 * Returns a random integer between `0` and `max` (inclusive).
 */
export const randomInt = (max: number): number =>
  Math.floor(Math.random() * (max + 1))

/**
 * Returns a random integer between `min` and `max` (inclusive).
 */
export const randomIntRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max + 1 - min)) + min

/**
 * Returns if the given number is even.
 */
export const even = (x: number): boolean => x % 2 === 0

/**
 * Returns if the given number is odd.
 */
export const odd = (x: number): boolean => x % 2 !== 0
