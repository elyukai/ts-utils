import { deepEqual } from "node:assert/strict"
import { describe, it } from "node:test"
import { anySame, anySameIndices, unique } from "../../src/array/filters.js"

describe("unique", () => {
  it("filters out duplicate values from an array", () => {
    deepEqual(unique([]), [])
    deepEqual(unique([1, 2, 3]), [1, 2, 3])
    deepEqual(unique([1, 2, 1, 3]), [1, 2, 3])
  })
})

describe("anySame", () => {
  it("returns false when given an empty array", () => {
    deepEqual(anySame([]), false)
  })

  it("checks for duplicate values from the array using shallow equality checks", () => {
    deepEqual(anySame([1, 2, 2, 3, 4, 4]), true)
  })

  it("checks for duplicate values from the array using custom equality checks", () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 1 }]
    const equalityCheck = (a: { id: number }, b: { id: number }) =>
      a.id === b.id
    deepEqual(anySame(arr, equalityCheck), true)
  })
})

describe("anySameIndices", () => {
  it("returns an empty array when given an empty array", () => {
    deepEqual(anySameIndices([]), [])
  })

  it("checks for duplicate values from the array using shallow equality checks", () => {
    deepEqual(anySameIndices([1, 2, 2, 3, 4, 4]), [
      [1, 2],
      [4, 5],
    ])
  })

  it("checks for duplicate values from the array using custom equality checks", () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 1 }]
    const equalityCheck = (a: { id: number }, b: { id: number }) =>
      a.id === b.id
    deepEqual(anySameIndices(arr, equalityCheck), [[0, 2]])
  })
})
