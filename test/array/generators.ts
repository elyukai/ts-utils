import { deepEqual } from "node:assert/strict"
import { describe, it } from "node:test"
import { flatCombine } from "../../src/array/generators.js"

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
