import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { wait } from "../src/async.js"
import { Dictionary as Dict } from "../src/dictionary.js"

describe("empty", () => {
  it("should be an empty object", () => {
    assert.deepEqual(Dict.empty, new Dict({}))
  })
})

describe("fromEntries", () => {
  it("should create a dictionary from entries", () => {
    const dict = Dict.fromEntries([
      ["a", 1],
      ["b", 2],
    ])
    assert.deepEqual(dict, new Dict({ a: 1, b: 2 }))
  })
})

describe("get", () => {
  it("should get the value for a key", () => {
    const dict = new Dict<number>({ a: 1, b: 2 })
    assert.equal(dict.get("a"), 1)
    assert.equal(dict.get("b"), 2)
    assert.equal(dict.get("c"), undefined)
  })
})

describe("getMap", () => {
  it("should get and map the value for a key", () => {
    const dict = new Dict<number>({ a: 1, b: 2 })
    assert.equal(
      dict.getMap("a", (v) => v * 2),
      2,
    )
    assert.equal(
      dict.getMap("b", (v) => v * 2),
      4,
    )
    assert.equal(
      dict.getMap("c", (v) => v * 2),
      undefined,
    )
  })
})

describe("has", () => {
  it("should check if a key exists", () => {
    const dict = new Dict<number>({ a: 1, b: 2 })
    assert.equal(dict.has("a"), true)
    assert.equal(dict.has("b"), true)
    assert.equal(dict.has("c"), false)
  })
})

describe("set", () => {
  it("should set the value for a key", () => {
    const dict = new Dict<number>({ a: 1, b: 2 })
    const newDict = dict.set("c", 3)
    assert.deepEqual(newDict, new Dict({ a: 1, b: 2, c: 3 }))
  })
})

describe("remove", () => {
  it("should remove a key", () => {
    const dict = new Dict({ a: 1, b: 2 })
    const newDict = dict.remove("a")
    assert.deepEqual(newDict, new Dict({ b: 2 }))
  })
})

describe("size", () => {
  it("should return the size of the dictionary", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    assert.equal(dict.size, 3)
    const emptyDict = Dict.empty
    assert.equal(emptyDict.size, 0)
  })
})

describe("keys", () => {
  it("should return the keys of the dictionary", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const keys = dict.keys()
    assert.deepEqual(keys.sort(), ["a", "b", "c"])
  })
})

describe("values", () => {
  it("should return the values of the dictionary", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const values = dict.values()
    assert.deepEqual(values.sort(), [1, 2, 3])
  })
})

describe("entries", () => {
  it("should return the entries of the dictionary", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const entries = dict.entries()
    assert.deepEqual(entries.sort(), [
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ])
  })
})

describe("forEach", () => {
  it("should iterate over each key-value pair", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const result: [string, number][] = []
    dict.forEach((value, key) => {
      result.push([key, value])
    })
    assert.deepEqual(result.sort(), [
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ])
  })
})

describe("forEachAsync", () => {
  it("should asynchronously iterate over each key-value pair", async () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const result: [string, number][] = []
    await dict.forEachAsync(async (value, key) => {
      await wait(10) // Simulate async operation
      result.push([key, value])
    })
    assert.deepEqual(result.sort(), [
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ])
  })
})

describe("modify", () => {
  it("should modify the value for a key", () => {
    const dict = new Dict({ a: 1, b: 2 })
    const newDict = dict.modify("a", (v) => (v !== undefined ? v + 10 : 0))
    assert.deepEqual(newDict, new Dict({ a: 11, b: 2 }))
  })

  it("should add a new key if it does not exist", () => {
    const dict = new Dict<number>({ a: 1, b: 2 })
    const newDict = dict.modify("c", (v) => (v !== undefined ? v + 10 : 0))
    assert.deepEqual(newDict, new Dict({ a: 1, b: 2, c: 0 }))
  })

  it("should remove the key if the modifier returns undefined", () => {
    const dict = new Dict({ a: 1, b: 2 })
    const newDict = dict.modify("a", () => undefined)
    assert.deepEqual(newDict, new Dict({ b: 2 }))
  })
})

describe("find", () => {
  it("should find a value by predicate", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const result = dict.find((value) => value === 2)
    assert.equal(result, 2)
  })

  it("should return undefined if no value matches", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const result = dict.find((value) => value === 4)
    assert.equal(result, undefined)
  })
})

describe("findKey", () => {
  it("should find a key by predicate", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const result = dict.findKey((_value, key) => key === "b")
    assert.equal(result, "b")
  })

  it("should return undefined if no key matches", () => {
    const dict = new Dict<number>({ a: 1, b: 2, c: 3 })
    const result = dict.findKey((_value, key) => key === "d")
    assert.equal(result, undefined)
  })
})

describe("findEntry", () => {
  it("should find an entry by predicate", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const result = dict.findEntry((value) => value === 3)
    assert.deepEqual(result, ["c", 3])
  })

  it("should return undefined if no entry matches", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const result = dict.findEntry((value) => value === 4)
    assert.equal(result, undefined)
  })
})

describe("mapFirst", () => {
  it("should map and return the first non-undefined result", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const result = dict.mapFirst((value) =>
      value % 2 === 0 ? value * 10 : undefined,
    )
    assert.equal(result, 20)
  })

  it("should return undefined if all results are undefined", () => {
    const dict = new Dict({ a: 1, b: 3, c: 5 })
    const result = dict.mapFirst((value) =>
      value % 2 === 0 ? value * 10 : undefined,
    )
    assert.equal(result, undefined)
  })
})

describe("map", () => {
  it("should map each key-value pair in the dictionary", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const result = dict.map((value) => value * 10)
    assert.deepEqual(result, new Dict({ a: 10, b: 20, c: 30 }))
  })
})

describe("reduce", () => {
  it("should reduce the dictionary to a single value", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const result = dict.reduce((acc, value) => acc + value, 0)
    assert.equal(result, 6)
  })
})

describe("toJSON", () => {
  it("should convert the dictionary to a plain object", () => {
    const dict = new Dict({ a: 1, b: 2, c: 3 })
    const json = JSON.stringify(dict)
    assert.equal(json, '{"a":1,"b":2,"c":3}')
  })
})
