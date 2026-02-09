/**
 * A helper type that builds a tuple type of a desired length.
 * @module
 */

/**
 * A recursive type that constructs an array of type `T` with a length of `N`.
 */
type FixedArrayAux<T, N extends number, A extends T[]> = A["length"] extends N
  ? A
  : FixedArrayAux<T, N, [...A, T]>

/**
 * A type representing an array of a fixed size `N` containing elements of type `T`.
 */
export type FixedArray<T, N extends number> = FixedArrayAux<T, N, []>
