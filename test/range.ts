import { deepEqual, equal, throws } from "node:assert/strict"
import { describe, it } from "node:test"
import {
  indexInRange,
  isInRange,
  range,
  rangeSafe,
  rangeSize,
} from "../src/range.js"

describe("range", () => {
  it("returns an array with all values between and including its bounds", () => {
    deepEqual(range([3, 3]), [3])
    deepEqual(range([3, 8]), [3, 4, 5, 6, 7, 8])
  })

  it("throws an errors if the upper bound is lower than the lower bound", () => {
    throws(() => range([3, 2]))
  })
})

describe("rangeSafe", () => {
  it("returns an array with all values between and including its bounds", () => {
    deepEqual(rangeSafe(3, 3), [3])
    deepEqual(rangeSafe(3, 8), [3, 4, 5, 6, 7, 8])
    deepEqual(rangeSafe(8, 3), [3, 4, 5, 6, 7, 8])
  })
})

describe("isInRange", () => {
  it("returns if the value is within the specified range", () => {
    equal(isInRange([1, 5], 1), true)
    equal(isInRange([1, 5], 3), true)
    equal(isInRange([1, 5], -1), false)
  })
})

describe("indexInRange", () => {
  it("returns if the value is within the specified bounds", () => {
    equal(indexInRange([1, 5], 3), 2)
    equal(indexInRange([1, 5], 1), 0)
  })

  it("throws if the value is not within the specified bounds", () => {
    throws(() => indexInRange([1, 5], -1))
  })
})

describe("rangeSize", () => {
  it("returns a positive integer if the range is valid", () => {
    equal(rangeSize([1, 5]), 5)
    equal(rangeSize([1, 1]), 1)
  })

  it("returns 0 if the upper bound is smaller than the lower bound", () => {
    equal(rangeSize([1, -2]), 0)
  })
})
