/**
 * A simple implementation of the Reader monad, which allows you to write functions that depend on some shared environment.
 * @module
 */

/**
 * The Reader monad represents a computation that depends on some shared environment. It allows you to write functions that can access this environment without having to pass it explicitly as an argument.
 * @template T The type of the value produced by the Reader.
 * @template R The type of the environment that the Reader depends on.
 */
export class Reader<T, R> {
  readonly #fn: (env: R) => T

  private constructor(fn: (env: R) => T) {
    this.#fn = fn
  }

  /**
   * Always produce the given value, regardless of the environment.
   */
  static of<T, R>(value: T): Reader<T, R> {
    return new Reader(() => value)
  }

  /**
   * Retrieve the entire environment.
   */
  static ask<R>(): Reader<R, R> {
    return new Reader((env) => env)
  }

  /**
   * Retrieve a transformed value of the environment.
   */
  static asks<T, R>(f: (env: R) => T): Reader<T, R> {
    return new Reader((env) => f(env))
  }

  /**
   * Applies the given function to the value produced by this Reader and returns a new Reader that produces the result.
   */
  map<U>(f: (value: T) => U): Reader<U, R> {
    return new Reader((env) => f(this.#fn(env)))
  }

  /**
   * Applies the given function to the value produced by this Reader and returns a new Reader that produces the result. The function must return a Reader, which allows you to chain computations that depend on the same environment.
   */
  then<U>(f: (value: T) => Reader<U, R>): Reader<U, R> {
    return new Reader((env) => f(this.#fn(env)).#fn(env))
  }

  /**
   * Computes the result by providing the required environment.
   */
  run(env: R): T {
    return this.#fn(env)
  }
}
