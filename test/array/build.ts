import assert from "node:assert"
import { deepEqual } from "node:assert/strict"
import { describe, it } from "node:test"
import { replicate, unfold } from "../../src/array/build.js"

describe("replicate", () => {
  it("replicates a value a given number of times and returns an array containing the replicated values", () => {
    deepEqual(replicate("x", 0), [])
    deepEqual(replicate("x", 3), ["x", "x", "x"])
    deepEqual(replicate("x", 6), ["x", "x", "x", "x", "x", "x"])
  })

  it("throws a RangeError when the count is negative", () => {
    const negativeCount = -1
    assert.throws(
      () => replicate("x", negativeCount),
      new RangeError(`count ${negativeCount.toString()} is negative`),
    )
  })
})

describe("unfold", () => {
  it("generates an array by repeatedly applying a function to a seed value until the function returns `undefined`", () => {
    const seed = 1
    const fn = (value: number): [number, number] | undefined =>
      value < 5 ? [value, value + 1] : undefined

    deepEqual(unfold(seed, fn), [1, 2, 3, 4])
  })

  it("returns an empty array when the function returns `undefined` on the first call", () => {
    const seed = 5
    const fn = (value: number): [number, number] | undefined =>
      value < 5 ? [value, value + 1] : undefined

    deepEqual(unfold(seed, fn), [])
  })
})
