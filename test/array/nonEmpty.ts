import { deepEqual } from "node:assert/strict"
import { describe, it } from "node:test"
import {
  ensureNonEmpty,
  isEmpty,
  isNotEmpty,
} from "../../src/array/nonEmpty.js"

describe("isEmpty", () => {
  it("returns true for an empty array", () => {
    deepEqual(isEmpty([]), true)
  })

  it("returns false for a non-empty array", () => {
    deepEqual(isEmpty([1, 2, 3]), false)
  })
})

describe("isNotEmpty", () => {
  it("returns false for an empty array", () => {
    deepEqual(isNotEmpty([]), false)
  })

  it("returns true for a non-empty array", () => {
    deepEqual(isNotEmpty([1, 2, 3]), true)
  })
})

describe("ensureNonEmpty", () => {
  it("returns undefined if the array is empty", () => {
    deepEqual(ensureNonEmpty([]), undefined)
  })

  it("returns the non-empty array as-is", () => {
    deepEqual(ensureNonEmpty([1, 2]), [1, 2])
  })
})
