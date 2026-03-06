import { deepEqual } from "node:assert/strict"
import { describe, it } from "node:test"
import { flatCombine, intercalate } from "../../src/array/transformations.ts"

describe("intercalate", () => {
  it("returns a new array with the given value intercalated between each element of the given array. An empty array is returned if the given array is empty.", () => {
    deepEqual(intercalate([], "x"), [])
    deepEqual(intercalate(["a"], "x"), ["a"])
    deepEqual(intercalate(["a", "b"], "x"), ["a", "x", "b"])
    deepEqual(intercalate(["a", "b", "c"], "x"), ["a", "x", "b", "x", "c"])
  })
})

describe("flatCombine", () => {
  it("returns the possibilities of all the combinations of nested array values.", () => {
    deepEqual(flatCombine([["a", "b"], ["c"]]), [
      ["a", "c"],
      ["b", "c"],
    ])
    deepEqual(
      flatCombine([
        ["a", "b"],
        ["c", "d"],
      ]),
      [
        ["a", "c"],
        ["b", "c"],
        ["a", "d"],
        ["b", "d"],
      ],
    )
  })
})
