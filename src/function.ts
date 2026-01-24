/**
 * Returns a function that always returns the given value.
 * @param value The value to return from the new function.
 * @returns A new function that always returns the given value.
 */
export const constant =
  <T>(value: T) =>
  () =>
    value

/**
 * Returns a function that applies the given predicates to the given value and
 * returns `true` if all predicates return `true`.
 */
export const andEvery =
  <T>(...predicates: ((value: T) => boolean)[]) =>
  (value: T): boolean =>
    predicates.every((predicate) => predicate(value))

export function orSome<T, U extends T, V extends T>(
  f: (value: T) => value is U,
  g: (value: T) => value is V,
): (value: T) => value is U | V
export function orSome<T>(
  ...fns: ((value: T) => boolean)[]
): (value: T) => boolean
/**
 * Returns a function that combines predicate functions disjunctionally.
 */
export function orSome<T>(
  ...predicates: ((value: T) => boolean)[]
): (value: T) => boolean {
  return (value) => predicates.some((predicate) => predicate(value))
}

/**
 * Returns a function that applies the given predicate to the given value and
 * returns the negated result.
 */
export const not =
  <T>(predicate: (value: T) => boolean) =>
  (value: T): boolean =>
    !predicate(value)

/**
 * Combines two values while applying an accessor to each value before combining them.
 *
 * This is useful for scenarios where you want to combine complex objects based on a specific property or derived value.
 *
 * @param accessor A function that extracts the value to be used for combination from each input.
 * @param combinator A function that combines the two extracted values.
 * @returns A new function that takes two inputs, applies the accessor to each, and combines the results using the combinator.
 *
 * @example
 * ```ts
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * const alice: Person = { name: "Alice", age: 30 };
 * const bob: Person = { name: "Bob", age: 25 };
 * const people: Person[] = [alice, bob];
 *
 * const compareByAge = on(
 *   (person: Person) => person.age,
 *   (age1, age2) => age1 - age2
 * );
 *
 * const sortedPeople = people.sort(compareByAge);
 * // Result: [{ name: "Bob", age: 25 }, { name: "Alice", age: 30 }]
 * ```
 */
export const on =
  <T, U, V>(
    accessor: (value: T) => U,
    combinator: (a: U, b: U) => V,
  ): ((a: T, b: T) => V) =>
  (a, b) =>
    combinator(accessor(a), accessor(b))
