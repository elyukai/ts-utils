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
    const reader = Reader.of(42).map(x => x + 1)
    equal(reader.run({}), 43)
  })
})

describe("then", () => {
  it("chains computations that depend on the same environment", () => {
    const reader = Reader.ask<{ foo: string }>().then(env => Reader.of(env.foo.length))
    equal(reader.run({ foo: "bar" }), 3)
  })
})

describe("thenW", () => {
  it("chains computations that depend on a shared environment", () => {
    const reader = Reader.ask<{ foo: string }>().thenW(env =>
      Reader.asks((otherEnv: { bar: number }) => env.foo.length + otherEnv.bar),
    )
    equal(reader.run({ foo: "bar", bar: 2 }), 5)
  })
})

describe("with", () => {
  it("modifies the environment for a specific computation", () => {
    const reader = Reader.ask<{ foo: string }>().with((env: { foo: string }) => ({
      ...env,
      foo: env.foo.toUpperCase(),
    }))
    deepEqual(reader.run({ foo: "bar" }), { foo: "BAR" })
  })
})

describe("traverse", () => {
  it("applies a function to each value in the array and returns a Reader that produces an array of the results", () => {
    const reader = Reader.traverse([1, 2, 3], x =>
      Reader.asks((env: { multiplier: number }) => x * env.multiplier),
    )
    deepEqual(reader.run({ multiplier: 2 }), [2, 4, 6])
  })
})

describe("sequence", () => {
  it("transforms an array of Readers into a Reader that produces an array of their results", () => {
    const readers: Reader<{ foo: string; bar: number }, string | number>[] = [
      Reader.asks((env: { foo: string }) => env.foo),
      Reader.asks((env: { bar: number }) => env.bar),
    ]
    const reader = Reader.sequence(readers)
    deepEqual(reader.run({ foo: "hello", bar: 42 }), ["hello", 42])
  })
})

describe("defer", () => {
  it("transforms a function that returns a Reader into a Reader that produces a function", () => {
    const reader = Reader.defer((x: number) =>
      Reader.asks((env: { multiplier: number }) => x * env.multiplier),
    )
    const multiplyBy2 = reader.run({ multiplier: 2 })
    equal(multiplyBy2(3), 6)
  })
})

describe("undefer", () => {
  it("transforms a Reader that produces a function into a function that returns a Reader", () => {
    const reader = Reader.undefer(
      Reader.asks((env: { multiplier: number }) => (x: number) => x * env.multiplier),
    )
    const multiplyBy2 = reader(2)
    equal(multiplyBy2.run({ multiplier: 3 }), 6)
  })
})
