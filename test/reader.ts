import { deepEqual, equal } from "node:assert/strict"
import { describe, it } from "node:test"
import { Reader } from "../src/reader.js"

describe("of", () => {
  it("always returns the same value", () => {
    const reader = Reader.of(42)
    equal(reader.run({}), 42)
    equal(reader.run({ foo: "bar" }), 42)
  })
})

describe("ask", () => {
  it("returns the entire environment", () => {
    const reader = Reader.ask()
    deepEqual(reader.run({ foo: "bar" }), { foo: "bar" })
  })
})

describe("asks", () => {
  it("returns a transformed value of the environment", () => {
    const reader = Reader.asks((env: { foo: string }) => env.foo)
    equal(reader.run({ foo: "bar" }), "bar")
  })
})

describe("map", () => {
  it("applies a function to the value produced by the Reader", () => {
    const reader = Reader.of(42).map((x) => x + 1)
    equal(reader.run({}), 43)
  })
})

describe("then", () => {
  it("chains computations that depend on the same environment", () => {
    const reader = Reader.ask<{ foo: string }>().then((env) =>
      Reader.of(env.foo.length),
    )
    equal(reader.run({ foo: "bar" }), 3)
  })
})
