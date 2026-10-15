/**
 * Utility functions for asynchronous operations that require Node.js.
 * @module
 */

import { access } from "node:fs/promises"

/**
 * Checks if a file or directory exists at the specified path.
 * @param path The path to the file or directory.
 * @returns A promise that resolves to `true` if the file or directory exists, otherwise `false`.
 */
export const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}
