import { equal } from "node:assert/strict"
import { describe, it } from "node:test"
import { even, odd } from "../src/number.js"

describe("even", () => {
  it("returns if the given number is even", () => {
    equal(even(-4), true)
    equal(even(-3), false)
    equal(even(-2), true)
    equal(even(-1), false)
    equal(even(0), true)
    equal(even(1), false)
    equal(even(2), true)
    equal(even(3), false)
    equal(even(4), true)
  })
})

describe("odd", () => {
  it("returns if the given number is odd", () => {
    equal(odd(-4), false)
    equal(odd(-3), true)
    equal(odd(-2), false)
    equal(odd(-1), true)
    equal(odd(0), false)
    equal(odd(1), true)
    equal(odd(2), false)
    equal(odd(3), true)
    equal(odd(4), false)
  })
})
