import { deepEqual } from "node:assert/strict"
import { describe, it } from "node:test"
import { State } from "../src/state.js"

describe("with", () => {
  it("modifies the state for a specific computation", () => {
    const state = State.get<number>().with(state => state + 1)
    deepEqual(state.run(41), [42, 42])
  })

  it("does not modify the state for computations that do not use the modified state", () => {
    const state = State.get<number>().then(oldState =>
      State.get<number>()
        .with(state => state + 1)
        .then(state2 => State.of<number, number>(oldState + state2).with(() => oldState)),
    )
    deepEqual(state.run(41), [83, 41])
  })
})
