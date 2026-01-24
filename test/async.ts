import { deepEqual, equal, fail, ok } from "node:assert/strict"
import { describe, it } from "node:test"
import { mapAsync, wait } from "../src/async.js"

describe("wait", async () => {
  await it("should wait for the specified delay", async () => {
    const start = Date.now()
    const delay = 100
    await wait(delay)
    const end = Date.now()
    ok(end - start >= delay)
  })
})

describe("mapAsync", () => {
  it("should process tasks with the specified concurrency", async () => {
    const tasks = [1, 2, 3, 4, 5]
    const results: number[] = []
    const worker = async (task: number): Promise<number> => {
      await wait(50)
      results.push(task)
      return task * 2
    }

    const concurrency = 2
    const output = await mapAsync(tasks, worker, concurrency)

    deepEqual(output, [2, 4, 6, 8, 10])
    deepEqual(results, [1, 2, 3, 4, 5])
  })

  it("should handle errors in worker function", async () => {
    const tasks = [1, 2, 3]
    const worker = async (task: number): Promise<number> => {
      if (task === 2) {
        throw new Error("Test error")
      }
      await wait(50)
      return task * 2
    }

    const concurrency = 2

    try {
      await mapAsync(tasks, worker, concurrency)
      fail("Expected error was not thrown")
    } catch (error) {
      equal((error as Error).message, "Test error")
    }
  })
})
