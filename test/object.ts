import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  hasKey,
  mapObject,
  mergeObjects,
  omitKeys,
  omitUndefinedKeys,
  onlyKeys,
  sortObjectKeys,
  sortObjectKeysByIndex,
} from "../src/object.js"

describe("mapObject", () => {
  it("maps all own properties of an object to a new object", () => {
    const object = { a: 1, b: 2, c: 3 }
    const result = mapObject(object, (value, key) => value.toString() + key)
    assert.deepEqual(result, { a: "1a", b: "2b", c: "3c" })
  })

  it("omits properties for which the mapping function returns undefined", () => {
    const object = { a: 1, b: 2, c: 3 }
    const result = mapObject(object, (value, key) =>
      key === "b" ? undefined : value.toString() + key,
    )
    assert.deepEqual(result, { a: "1a", c: "3c" })
  })
})

describe("sortObjectKeysByIndex", () => {
  it("sorts the keys of an object based on the order of the provided keys array", () => {
    const obj = { b: 2, a: 1, c: 3, d: 4 }
    const keys = ["c", "a"]
    const result = sortObjectKeysByIndex(obj, keys)
    assert.deepEqual(result, { c: 3, a: 1, b: 2, d: 4 })
    assert.deepEqual(Object.keys(result), ["c", "a", "b", "d"])
  })
})

describe("sortObjectKeys", () => {
  it("sorts the keys of an object in ascending lexicographical order by default", () => {
    const obj = { b: 2, a: 1, c: 3 }
    const result = sortObjectKeys(obj)
    assert.deepEqual(result, { a: 1, b: 2, c: 3 })
    assert.deepEqual(Object.keys(result), ["a", "b", "c"])
  })

  it("sorts the keys of an object using the provided comparison function", () => {
    const obj = { b: 2, a: 1, c: 3 }
    const result = sortObjectKeys(obj, (a, b) => b.localeCompare(a))
    assert.deepEqual(result, { c: 3, b: 2, a: 1 })
    assert.deepEqual(Object.keys(result), ["c", "b", "a"])
  })
})

describe("mergeObjects", () => {
  it("merges two objects using the provided conflict resolution function", () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: 3, c: 4 }
    const result = mergeObjects(obj1, obj2, (a, b) => a + b)
    assert.deepEqual(result, { a: 1, b: 5, c: 4 })
  })
})

describe("onlyKeys", () => {
  it("keeps only the specified keys in an object", () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = onlyKeys(obj, "a", "c")
    assert.deepEqual(result, { a: 1, c: 3 })
  })
})

describe("hasKey", () => {
  it("checks if an object has the specified key as its own property", () => {
    const obj = { a: 1, b: 2 }
    assert.equal(hasKey(obj, "a"), true)
    assert.equal(hasKey(obj, "c"), false)
  })
})

describe("omitUndefinedKeys", () => {
  it("omits all keys with undefined values from an object", () => {
    const obj = { a: 1, b: undefined, c: 3, d: undefined }
    const result = omitUndefinedKeys(obj)
    assert.deepEqual(result, { a: 1, c: 3 })
  })
})

describe("omitKeys", () => {
  it("omits the specified keys from an object", () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omitKeys(obj, "b", "c")
    assert.deepEqual(result, { a: 1 })
  })
})
