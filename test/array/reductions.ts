import { deepEqual, equal } from "node:assert/strict"
import { describe, it } from "node:test"
import {
  count,
  countBy,
  countByMany,
  reduceWhile,
  someCount,
  sum,
  sumWith,
} from "../../src/array/reductions.js"

describe("reduceWhile", () => {
  it("should return the initial value for an empty array", () => {
    const result = reduceWhile(
      [],
      (acc, value) => acc + (value as number),
      () => false,
      10,
    )
    equal(result, 10)
  })

  it("should correctly reduce the array", () => {
    const result = reduceWhile(
      [1, 2, 3, 4, 5],
      (acc, value) => acc + value,
      () => false,
      0,
    )
    equal(result, 15)
  })

  it("should break early and return the correct value", () => {
    const result = reduceWhile(
      [1, 2, 3, 4, 5],
      (acc, value) => acc + value,
      (acc) => acc > 3,
      0,
    )
    equal(result, 6)
  })
})

describe("sum", () => {
  it("returns 0 if the array is empty", () => {
    equal(sum([]), 0)
  })

  it("returns the sum of all numbers in the array", () => {
    equal(sum([1]), 1)
    equal(sum([1, 2]), 3)
    equal(sum([1, 2, 3]), 6)
    equal(sum([1, 2, 3, 4]), 10)
  })
})

describe("sumWith", () => {
  it("returns 0 if the array is empty", () => {
    equal(
      sumWith([], (x) => x * 2),
      0,
    )
  })

  it("returns the sum of all mapped numbers in the array", () => {
    equal(
      sumWith([1], (x) => x * 2),
      2,
    )
    equal(
      sumWith([1, 2], (x) => x * 2),
      6,
    )
    equal(
      sumWith([1, 2, 3], (x) => x * 2),
      12,
    )
    equal(
      sumWith([1, 2, 3, 4], (x) => x * 2),
      20,
    )
  })
})

describe("count", () => {
  it("returns how many elements satify the given predicate", () => {
    equal(
      count([], (x) => x > 3),
      0,
    )
    equal(
      count([0, 2, 3], (x) => x >= 3),
      1,
    )
    equal(
      count([0, 2, 4, 6, 8], (x) => x > 3),
      3,
    )
  })
})

describe("countBy", () => {
  it("returns an empty object of the array is empty", () => {
    deepEqual(
      countBy([], (x) => x % 2),
      {},
    )
  })
  it("returns for how many elements the function returns the same value", () => {
    deepEqual(
      countBy([0, 2, 3], (x) => x % 2),
      { 0: 2, 1: 1 },
    )
    deepEqual(
      countBy([0, 2, 4, 6, 8], (x) => x % 2),
      { 0: 5 },
    )
  })
})

describe("countByMany", () => {
  it("returns an empty object of the array is empty", () => {
    deepEqual(
      countByMany([], (x) => [x, Math.round(x / 2), x % 2]),
      {},
    )
  })
  it("returns for how many elements the function returns the same value", () => {
    deepEqual(
      countByMany([0, 2, 3], (x) => [x, Math.round(x / 2), x % 2]),
      { 0: 2, 1: 2, 2: 2, 3: 1 },
    )
    deepEqual(
      countByMany([0, 2, 4, 6, 8], (x) => [x, Math.round(x / 2), x % 2]),
      { 0: 5, 1: 1, 2: 2, 3: 1, 4: 2, 6: 1, 8: 1 },
    )
  })
})

describe("someCount", () => {
  it("should return true if the array has the required minimum elements that satisfy the predicate", () => {
    const result = someCount([1, 2, 3, 4, 5], (value) => value > 2, 3)
    equal(result, true)
  })

  it("should return false if the array does not have the required minimum elements that satisfy the predicate", () => {
    const result = someCount([1, 2, 3, 4, 5], (value) => value > 5, 3)
    equal(result, false)
  })

  it("should return true for an array that has exactly the required number of elements satisfying the predicate", () => {
    const result = someCount([1, 2, 3, 4, 5], (value) => value > 3, 2)
    equal(result, true)
  })

  it("should return false for an empty array", () => {
    const result = someCount([], (value) => value === 0, 2)
    equal(result, false)
  })
})
