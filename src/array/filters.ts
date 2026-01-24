/**
 * Filters out duplicate values from an array. Objects are not supported, since
 * they don’t provide value equality semantics.
 */
export const unique = <
  T extends number | boolean | string | symbol | null | undefined,
>(
  arr: T[],
): T[] => Array.from(new Set(arr))
