/**
 * A pair that specifies the lower (including) and upper (including) bounds of a
 * contiguous subrange of integer values.
 */
export type RangeBounds = [lowerBound: number, upperBound: number]

const normalizeBounds = (bounds: [RangeBounds] | RangeBounds): RangeBounds =>
  bounds.length === 1 ? bounds[0] : bounds

/**
 * The list of values in the subrange defined by a bounding pair.
 * @throws {RangeError} If the upper bound is lower than the lower bound.
 */
export const range: {
  (...args: RangeBounds): number[]
  (bounds: RangeBounds): number[]
} = (...args: [bounds: RangeBounds] | RangeBounds): number[] => {
  const [start, end] = normalizeBounds(args)

  if (start > end) {
    throw new RangeError(
      "The upper bound must be greater than or equal to the lower bound.",
    )
  }

  return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}

/**
 * Returns a range of numbers between and including two numbers. The order of
 * the arguments does not matter.
 * @param start The first number in the range.
 * @param end The last number in the range.
 */
export const rangeSafe: {
  (...args: RangeBounds): number[]
  (bounds: RangeBounds): number[]
} = (...args: [bounds: RangeBounds] | RangeBounds): number[] => {
  const [start, end] = normalizeBounds(args)
  return start > end ? range(end, start) : range(start, end)
}

/**
 * Checks whether the passed `value` is within the range specified by the passed
 * `bounds`.
 */
export const isInRange = (bounds: RangeBounds, value: number): boolean =>
  value >= bounds[0] && value <= bounds[1]

/**
 * Returns the index of a value in a range.
 * @throws {RangeError} If the passed `value` is not within the range specified.
 */
export const indexInRange = (bounds: RangeBounds, value: number): number => {
  if (!isInRange(bounds, value)) {
    throw new RangeError(
      `indexInRange: index for ${value.toString()} is out of range (${bounds[0].toString()}...${bounds[1].toString()})`,
    )
  }

  return value - bounds[0]
}

/**
 * Returns the size of the range defined by the passed bounds.
 */
export const rangeSize = (bounds: RangeBounds): number =>
  bounds[0] <= bounds[1] ? bounds[1] - bounds[0] + 1 : 0
