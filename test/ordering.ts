import { deepEqual, equal } from "node:assert/strict"
import { describe, it } from "node:test"
import { on } from "../src/function.js"
import {
  compareDate,
  compareNullish,
  compareNumber,
  reduceCompare,
  reverse,
} from "../src/ordering.js"

describe("reduceCompare", () => {
  it("chains multiple comparison functions", () => {
    deepEqual(
      [
        { first: 2, second: 6 },
        { first: 2, second: 2 },
        { first: 1, second: 2 },
        { first: 3, second: 1 },
        { first: 1, second: 6 },
        { first: 2, second: 3 },
      ].sort(
        reduceCompare(
          on((x) => x.first, compareNumber),
          on((x) => x.second, reverse(compareNumber)),
        ),
      ),
      [
        { first: 1, second: 6 },
        { first: 1, second: 2 },
        { first: 2, second: 6 },
        { first: 2, second: 3 },
        { first: 2, second: 2 },
        { first: 3, second: 1 },
      ],
    )
  })
})

describe("compareNumber", () => {
  it("compares numbers in ascending order", () => {
    equal(compareNumber(1, 1), 0)
    equal(compareNumber(1, 2) < 0, true)
    equal(compareNumber(2, 1) > 0, true)
  })
})

describe("compareDate", () => {
  it("returns a negative value if the first date is earlier than the second date", () => {
    equal(
      compareDate(
        new Date(2000, 0, 1, 12, 0, 0, 100),
        new Date(2000, 0, 1, 12, 0, 0, 200),
      ),
      -100,
    )
  })

  it("returns a positive value if the first date is later than the second date", () => {
    equal(
      compareDate(
        new Date(2000, 0, 1, 12, 0, 0, 300),
        new Date(2000, 0, 1, 12, 0, 0, 200),
      ),
      100,
    )
  })

  it("returns zero if the first date is equal to the second date", () => {
    equal(
      compareDate(
        new Date(2000, 0, 1, 12, 0, 0, 200),
        new Date(2000, 0, 1, 12, 0, 0, 200),
      ),
      0,
    )
  })
})

describe("compareNullish", () => {
  const compareNullishNumber = compareNullish(compareNumber)

  it("sorts nullish values before non-nullish values", () => {
    deepEqual([3, null, 1, undefined, 2].sort(compareNullishNumber), [
      1,
      2,
      3,
      null,
      undefined,
    ])
  })

  it("sorts non-nullish values using the provided compare function", () => {
    deepEqual([3, 1, 2].sort(compareNullishNumber), [1, 2, 3])
  })

  it("treats two nullish values as equal", () => {
    equal(compareNullishNumber(null, undefined), 0)
  })
})

describe("reverse", () => {
  it("reverses the order of a compare function", () => {
    equal(reverse(compareNumber)(1, 1), 0)
    equal(reverse(compareNumber)(1, 2) > 0, true)
    equal(reverse(compareNumber)(2, 1) < 0, true)
  })
})
