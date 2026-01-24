import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { wait } from "../src/async.js"

describe("wait", async () => {
  await it("should wait for the specified delay", async () => {
    const start = Date.now()
    const delay = 100
    await wait(delay)
    const end = Date.now()
    assert.ok(end - start >= delay)
  })
})
