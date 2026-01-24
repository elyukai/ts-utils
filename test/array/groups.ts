import { deepEqual, throws } from "node:assert/strict"
import { describe, it } from "node:test"
import { chunk, groupBy, partition } from "../../src/array/groups.js"

describe("partition", () => {
  it("splits all array elements into two separate arrays based on a predicate", () => {
    deepEqual(
      partition([], (x) => x >= 3),
      [[], []],
    )
    deepEqual(
      partition([0, 2, 3], (x) => x >= 3),
      [[3], [0, 2]],
    )
    deepEqual(
      partition([0, 2, 4, 6, 8], (x) => x >= 3),
      [
        [4, 6, 8],
        [0, 2],
      ],
    )
  })

  it("keeps the original order of elements", () => {
    deepEqual(
      partition([4, 8, 2, 7, 5, 6, 1, 3], (x) => x >= 3),
      [
        [4, 8, 7, 5, 6, 3],
        [2, 1],
      ],
    )
  })
})

describe("groupBy", () => {
  it("should return an empty array for an empty input", () => {
    const result = groupBy([], (a, b) => a === b)
    deepEqual(result, [])
  })

  it("should group adjacent elements that are equal", () => {
    const result = groupBy([1, 1, 2, 2, 2, 3, 4, 4, 4, 4], (a, b) => a === b)
    deepEqual(result, [[1, 1], [2, 2, 2], [3], [4, 4, 4, 4]])
  })
})

describe("chunk", () => {
  it("splits the array into chunks of the given size", () => {
    deepEqual(chunk([1, 2, 3, 4, 5, 6, 7, 8, 9], 4), [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9],
    ])
  })

  it("returns an empty array when given an empty array", () => {
    deepEqual(chunk([], 3), [])
  })

  it("throws an error if the chunk size is less than or equal to zero", () => {
    throws(() => chunk([1, 2, 3], 0), RangeError)
    throws(() => chunk([1, 2, 3], -1), RangeError)
  })
})
