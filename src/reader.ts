/**
 * A simple implementation of the Reader monad, which allows you to write functions that depend on some shared environment.
 * @module
 */

import { identity } from "./function.ts"

// A simpler wrapper for working with text that is generated based on different contexts, which encapsulates the context and reduces main code clutter. The context is only applied in the end.
/**
 * The Reader monad represents a computation that depends on some shared environment. It allows you to write functions that can access this environment without having to pass it explicitly as an argument.
 * @template T The type of the value produced by the Reader.
 * @template R The type of the environment that the Reader depends on.
 */
export class Reader<in R, out T> {
  readonly #fn: (env: R) => T

  private constructor(fn: (env: R) => T) {
    this.#fn = fn
  }

  /**
   * Always produce the given value, regardless of the environment.
   */
  static of<R = unknown, T = never>(value: T): Reader<R, T> {
    return new Reader(() => value)
  }

  /**
   * Retrieve the entire environment.
   */
  static ask<R>(): Reader<R, R> {
    return new Reader(env => env)
  }

  /**
   * Retrieve a transformed value of the environment.
   */
  static asks<R, T>(f: (env: R) => T): Reader<R, T> {
    return new Reader(env => f(env))
  }

  /**
   * Applies the given function to the value produced by this Reader and returns a new Reader that produces the result.
   */
  map<U>(f: (value: T) => U): Reader<R, U> {
    return new Reader(env => f(this.#fn(env)))
  }

  /**
   * Combines this Reader with another Reader by applying a function to both of their results and returning a new Reader that produces the result.
   */
  map2<U, V>(other: Reader<R, U>, f: (first: T, second: U) => V): Reader<R, V> {
    return new Reader(env => f(this.#fn(env), other.#fn(env)))
  }

  /**
   * Applies the given function to the value produced by this Reader and returns a new Reader that produces the result. The function must return a Reader, which allows you to chain computations that depend on the same environment.
   */
  then<U>(f: (value: T) => Reader<R, U>): Reader<R, U> {
    return new Reader(env => f(this.#fn(env)).#fn(env))
  }

  /**
   * Applies the given function to the value produced by this Reader and returns a new Reader that produces the result. The function must return a Reader, which allows you to chain computations that depend on a shared environment. The environments do not have to be the same, but will need to be combined.
   *
   * The suffix ‘W’ stands for ‘widening’, as this method allows you to widen the environment that the Reader depends on.
   */
  thenW<U, S>(f: (value: T) => Reader<S, U>): Reader<R & S, U> {
    return new Reader(env => f(this.#fn(env)).#fn(env))
  }

  /**
   * Modifies the environment for this Reader by applying the given function to it before running the computation.
   *
   * This allows you to adapt the environment for a specific computation without changing the original Reader.
   */
  with<S>(modifyEnv: (env: S) => R): Reader<S, T> {
    return new Reader(env => this.#fn(modifyEnv(env)))
  }

  /**
   * Computes the result by providing the required environment.
   */
  run(env: R): T {
    return this.#fn(env)
  }

  /**
   * Apply a function to each value in the array, and return a Reader that produces an array of the results.
   */
  static traverse<T, R, U>(values: T[], fn: (value: T) => Reader<R, U>): Reader<R, U[]> {
    return new Reader(env => values.map(value => fn(value).run(env)))
  }

  /**
   * Evaluate each reader in the array, and collect the results in a single reader instance.
   */
  static sequence<R, T>(readers: Reader<R, T>[]): Reader<R, T[]> {
    return Reader.traverse(readers, identity)
  }

  /**
   * Transforms a function that returns a Reader into a Reader that produces a function.
   *
   * This makes functions producing Readers that depend on more arguments sometimes easier to work with.
   */
  static defer<Args extends unknown[], R, T>(
    fn: (...args: Args) => Reader<R, T>,
  ): Reader<R, (...args: Args) => T> {
    return new Reader(
      env =>
        (...args: Args) =>
          fn(...args).run(env),
    )
  }

  /**
   * Transforms a Reader that produces a function into a function that returns a Reader.
   *
   * This is the inverse of {@link defer}.
   */
  static undefer<Args extends unknown[], R, T>(
    reader: Reader<R, (...args: Args) => T>,
  ): (...args: Args) => Reader<R, T> {
    return (...args: Args) => new Reader(env => reader.run(env)(...args))
  }
}

// type Readable<T> =
//   T extends Record<string, unknown>
//     ? { [K in keyof T]: Readable<T[K]> }
//     : T
