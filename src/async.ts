/**
 * Returns a promise that resolves after a specified delay in milliseconds.
 * @param delay The delay in milliseconds.
 * @returns A promise that resolves after the specified delay.
 *
 * @example
 * ```ts
 * await wait(1000); // Waits for 1 second
 * ```
 */
export const wait = (delay: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delay))
