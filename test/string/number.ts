import { equal } from "node:assert/strict"
import { describe, it } from "node:test"
import {
  parseInt,
  parseNat,
  sign,
  signIgnoreZero,
  signStr,
} from "../../src/string/number.js"

describe("signIgnoreZero", () => {
  it("adds a typographic minus sign to a negative number", () => {
    equal(signIgnoreZero(-1), "−\u20601")
  })

  it("adds a plus sign to a positive number", () => {
    equal(signIgnoreZero(1), "+1")
  })

  it("returns undefined on zero", () => {
    equal(signIgnoreZero(0), undefined)
  })
})

describe("sign", () => {
  it("adds a typographic minus sign to a negative number", () => {
    equal(sign(-1), "−\u20601")
  })

  it("adds a plus sign to a positive number", () => {
    equal(sign(1), "+1")
  })

  it("returns 0 on zero", () => {
    equal(sign(0), "0")
  })
})

describe("signStr", () => {
  it("returns a typographic minus sign on a negative number", () => {
    equal(signStr(-1), "−")
  })

  it("returns a plus sign on a positive number", () => {
    equal(signStr(1), "+")
  })

  it("returns undefined on zero", () => {
    equal(signStr(0), undefined)
  })
})

describe("parseInt", () => {
  it("parses a string that completely represents an integer", () => {
    equal(parseInt("2"), 2)
    equal(parseInt("-2"), -2)
    equal(parseInt("10"), 10)
    equal(parseInt("-10"), -10)
  })

  it("returns undefined if the full string does not represent an integer", () => {
    equal(parseInt(""), undefined)
    equal(parseInt(" 2"), undefined)
    equal(parseInt("01"), undefined)
    equal(parseInt("1.4"), undefined)
    equal(parseInt("1,4"), undefined)
    equal(parseInt("1n"), undefined)
    equal(parseInt("NaN"), undefined)
  })
})

describe("parseNat", () => {
  it("parses a string that completely represents an integer", () => {
    equal(parseNat("2"), 2)
    equal(parseNat("10"), 10)
  })

  it("returns undefined if the full string does not represent an integer", () => {
    equal(parseNat("-2"), undefined)
    equal(parseNat("-10"), undefined)
    equal(parseNat(""), undefined)
    equal(parseNat(" 2"), undefined)
    equal(parseNat("01"), undefined)
    equal(parseNat("1.4"), undefined)
    equal(parseNat("1,4"), undefined)
    equal(parseNat("1n"), undefined)
    equal(parseNat("NaN"), undefined)
  })
})
