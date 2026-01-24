import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { wait } from "../../src/async.js"
import * as Dict from "../../src/dictionary/native.js"

describe("empty", () => {
  it("should be an empty object", () => {
    assert.deepEqual(Dict.empty, {})
  })
})

describe("fromEntries", () => {
  it("should create a dictionary from entries", () => {
    const dict = Dict.fromEntries([
      ["a", 1],
      ["b", 2],
    ])
    assert.deepEqual(dict, { a: 1, b: 2 })
  })
})

describe("get", () => {
  it("should get the value for a key", () => {
    const dict = { a: 1, b: 2 }
    assert.equal(Dict.get(dict, "a"), 1)
    assert.equal(Dict.get(dict, "b"), 2)
    assert.equal(Dict.get(dict, "c"), undefined)
  })
})

describe("getMap", () => {
  it("should get and map the value for a key", () => {
    const dict = { a: 1, b: 2 }
    assert.equal(
      Dict.getMap(dict, "a", (v) => v * 2),
      2,
    )
    assert.equal(
      Dict.getMap(dict, "b", (v) => v * 2),
      4,
    )
    assert.equal(
      Dict.getMap(dict, "c", (v) => v * 2),
      undefined,
    )
  })
})

describe("has", () => {
  it("should check if a key exists", () => {
    const dict = { a: 1, b: 2 }
    assert.equal(Dict.has(dict, "a"), true)
    assert.equal(Dict.has(dict, "b"), true)
    assert.equal(Dict.has(dict, "c"), false)
  })
})

describe("set", () => {
  it("should set the value for a key", () => {
    const dict = { a: 1, b: 2 }
    const newDict = Dict.set(dict, "c", 3)
    assert.deepEqual(newDict, { a: 1, b: 2, c: 3 })
  })
})

describe("remove", () => {
  it("should remove a key", () => {
    const dict = { a: 1, b: 2 }
    const newDict = Dict.remove(dict, "a")
    assert.deepEqual(newDict, { b: 2 })
  })
})

describe("size", () => {
  it("should return the size of the dictionary", () => {
    const dict = { a: 1, b: 2, c: 3 }
    assert.equal(Dict.size(dict), 3)
    const emptyDict = {}
    assert.equal(Dict.size(emptyDict), 0)
  })
})

describe("keys", () => {
  it("should return the keys of the dictionary", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const keys = Dict.keys(dict)
    assert.deepEqual(keys.sort(), ["a", "b", "c"])
  })
})

describe("values", () => {
  it("should return the values of the dictionary", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const values = Dict.values(dict)
    assert.deepEqual(values.sort(), [1, 2, 3])
  })
})

describe("entries", () => {
  it("should return the entries of the dictionary", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const entries = Dict.entries(dict)
    assert.deepEqual(entries.sort(), [
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ])
  })
})

describe("forEach", () => {
  it("should iterate over each key-value pair", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const result: [string, number][] = []
    Dict.forEach(dict, (value, key) => {
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
    const dict = { a: 1, b: 2, c: 3 }
    const result: [string, number][] = []
    await Dict.forEachAsync(dict, async (value, key) => {
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
    const dict = { a: 1, b: 2 }
    const newDict = Dict.modify(dict, "a", (v) =>
      v !== undefined ? v + 10 : 0,
    )
    assert.deepEqual(newDict, { a: 11, b: 2 })
  })

  it("should add a new key if it does not exist", () => {
    const dict = { a: 1, b: 2 }
    const newDict = Dict.modify(dict, "c", (v) =>
      v !== undefined ? v + 10 : 0,
    )
    assert.deepEqual(newDict, { a: 1, b: 2, c: 0 })
  })

  it("should remove the key if the modifier returns undefined", () => {
    const dict = { a: 1, b: 2 }
    const newDict = Dict.modify(dict, "a", () => undefined)
    assert.deepEqual(newDict, { b: 2 })
  })
})

describe("find", () => {
  it("should find a value by predicate", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const result = Dict.find(dict, (value) => value === 2)
    assert.equal(result, 2)
  })

  it("should return undefined if no value matches", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const result = Dict.find(dict, (value) => value === 4)
    assert.equal(result, undefined)
  })
})

describe("findKey", () => {
  it("should find a key by predicate", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const result = Dict.findKey(dict, (_value, key) => key === "b")
    assert.equal(result, "b")
  })

  it("should return undefined if no key matches", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const result = Dict.findKey(dict, (_value, key) => key === "d")
    assert.equal(result, undefined)
  })
})

describe("findEntry", () => {
  it("should find an entry by predicate", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const result = Dict.findEntry(dict, (value) => value === 3)
    assert.deepEqual(result, ["c", 3])
  })

  it("should return undefined if no entry matches", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const result = Dict.findEntry(dict, (value) => value === 4)
    assert.equal(result, undefined)
  })
})

describe("mapFirst", () => {
  it("should map and return the first non-undefined result", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const result = Dict.mapFirst(dict, (value) =>
      value % 2 === 0 ? value * 10 : undefined,
    )
    assert.equal(result, 20)
  })

  it("should return undefined if all results are undefined", () => {
    const dict = { a: 1, b: 3, c: 5 }
    const result = Dict.mapFirst(dict, (value) =>
      value % 2 === 0 ? value * 10 : undefined,
    )
    assert.equal(result, undefined)
  })
})

describe("map", () => {
  it("should map each key-value pair in the dictionary", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const result = Dict.map(dict, (value) => value * 10)
    assert.deepEqual(result, { a: 10, b: 20, c: 30 })
  })
})

describe("reduce", () => {
  it("should reduce the dictionary to a single value", () => {
    const dict = { a: 1, b: 2, c: 3 }
    const result = Dict.reduce(dict, (acc, value) => acc + value, 0)
    assert.equal(result, 6)
  })
})
