import { equal } from "node:assert/strict"
import { describe, it } from "node:test"
import {
  arrayEqual,
  deepEqual,
  equal as eq,
  gt,
  gte,
  lt,
  lte,
  notEqual as neq,
} from "../src/equality.js"

describe("lt", () => {
  it("returns true if a is less than b", () => {
    equal(lt(1, 1), false)
    equal(lt(1, 2), true)
    equal(lt(2, 1), false)
  })
})

describe("lte", () => {
  it("returns true if a is less than or equal to b", () => {
    equal(lte(1, 1), true)
    equal(lte(1, 2), true)
    equal(lte(2, 1), false)
  })
})

describe("gt", () => {
  it("returns true if a is greater than b", () => {
    equal(gt(1, 1), false)
    equal(gt(1, 2), false)
    equal(gt(2, 1), true)
  })
})

describe("gte", () => {
  it("returns true if a is greater than or equal to b", () => {
    equal(gte(1, 1), true)
    equal(gte(1, 2), false)
    equal(gte(2, 1), true)
  })
})

describe("equal", () => {
  it("returns true if a is equal to b", () => {
    equal(eq(1, 1), true)
    equal(eq(1, 2), false)
    equal(eq(2, 1), false)
    equal(eq(NaN, NaN), true)
    equal(eq(0, -0), false)
  })
})

describe("notEqual", () => {
  it("returns true if a is not equal to b", () => {
    equal(neq(1, 1), false)
    equal(neq(1, 2), true)
    equal(neq(2, 1), true)
    equal(neq(NaN, NaN), false)
    equal(neq(0, -0), true)
  })
})

describe("arrayEqual", () => {
  it("returns true if two arrays are equal", () => {
    equal(arrayEqual([1, 2, 3], [1, 2, 3]), true)
    equal(arrayEqual([1, 2, 3], [1, 2, 4]), false)
    equal(arrayEqual([1, 2, 3], [1, 2]), false)
    equal(arrayEqual([1, 2, NaN], [1, 2, NaN]), true)
    equal(arrayEqual([0, -0], [0, -0]), true)
    equal(arrayEqual([0, -0], [-0, 0]), false)
  })
})

describe(deepEqual.name, () => {
  it("returns true if two objects are equal", () => {
    const object1 = { a: 1, b: { c: 2, d: [3, 4] } }
    const object2 = { a: 1, b: { c: 2, d: [3, 4] } }
    const object3 = { a: 1, b: { c: 2, d: [3, 4, 5] } }
    const object4 = { a: 1, b: { c: 2 } }
    const object5 = { a: 1, b: { c: 3 } }
    const object6 = { a: 1, b: { c: 2, d: 4 } }

    equal(deepEqual(object1, object2), true)
    equal(deepEqual(object1, object3), false)
    equal(deepEqual(object4, object5), false)
    equal(deepEqual(object4, object6), false)
  })

  it("returns true if two objects are equal", () => {
    const array1 = [1, 2, [3, 4, [5, 6]]]
    const array2 = [1, 2, [3, 4, [5, 6]]]
    const array3 = [1, 2, [3, 4, [5, 7]]]

    equal(deepEqual(array1, array2), true)
    equal(deepEqual(array1, array3), false)
  })

  it("returns true if two mixed objects and arrays are equal", () => {
    const mixed1 = { a: 1, b: [2, 3, { c: 4, d: [5, 6] }] }
    const mixed2 = { a: 1, b: [2, 3, { c: 4, d: [5, 6] }] }
    const mixed3 = { a: 1, b: [2, 3, { c: 4, d: [5, 7] }] }

    equal(deepEqual(mixed1, mixed2), true)
    equal(deepEqual(mixed1, mixed3), false)
  })
})
