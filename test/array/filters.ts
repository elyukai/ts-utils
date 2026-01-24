import { deepEqual } from "node:assert/strict"
import { describe, it } from "node:test"
import { unique } from "../../src/array/filters.js"

describe("unique", () => {
  it("filters out duplicate values from an array", () => {
    deepEqual(unique([]), [])
    deepEqual(unique([1, 2, 3]), [1, 2, 3])
    deepEqual(unique([1, 2, 1, 3]), [1, 2, 3])
  })
})
