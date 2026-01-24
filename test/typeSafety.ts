import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { assertExhaustive, trySafe } from "../src/typeSafety.js"

describe("assertExhaustive", () => {
  it("should throw an error with the message 'The switch is not exhaustive.'", () => {
    assert.throws(
      // @ts-expect-error The function should never receive a value.
      () => assertExhaustive(""),
      (err) =>
        err instanceof Error && err.message === "The switch is not exhaustive.",
    )
  })

  it("should throw an error with a custom message", () => {
    assert.throws(
      // @ts-expect-error The function should never receive a value.
      () => assertExhaustive("", "Custom error message"),
      (err) => err instanceof Error && err.message === "Custom error message",
    )
  })
})

describe("trySafe", () => {
  it("should return the result of the function if no error is thrown", () => {
    const result = trySafe(() => 42)
    assert.equal(result, 42)
  })

  it("should return undefined if an error is thrown and no default value is provided", () => {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const result = trySafe(() => {
      throw new Error("Test error")
    })
    assert.equal(result, undefined)
  })

  it("should return the default value if an error is thrown", () => {
    const result = trySafe(() => {
      throw new Error("Test error")
    }, 100)
    assert.equal(result, 100)
  })
})
