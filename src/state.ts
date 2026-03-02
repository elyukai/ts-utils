/**
 * The {@link State} class representing a state transformation function and includes methods to chain functions effectively.
 * @module
 */

/**
 * A class representing a state transformation function that takes an initial state and returns a tuple containing a value and a new state.
 */
export class State<S, T> {
  #fn: (state: S) => [T, S]

  private constructor(fn: (state: S) => [T, S]) {
    this.#fn = fn
  }

  /**
   * Returns a new {@link State} instance that returns the state as the resulting value without modifying the state.
   */
  static get<S>(): State<S, S> {
    return new State(state => [state, state])
  }

  /**
   * Applies the state transformation function to the given state and returns a tuple containing the resulting value and the new state.
   */
  run(state: S): [T, S] {
    return this.#fn(state)
  }

  /**
   * Applies the state transformation function to the given state and returns the resulting value, discarding the new state.
   */
  eval(state: S): T {
    return this.run(state)[0]
  }

  /**
   * Applies the state transformation function to the given state and returns the new state, discarding the resulting value.
   */
  exec(state: S): S {
    return this.run(state)[1]
  }

  /**
   * Returns a new {@link State} instance that returns the given value without modifying the state.
   */
  static of<S, T>(value: T): State<S, T> {
    return new State(state => [value, state])
  }

  /**
   * Transforms the value produced by this state transformation function using the given function, while keeping the state unchanged.
   */
  map<U>(f: (value: T) => U): State<S, U> {
    return new State(state => {
      const [value, newState] = this.run(state)
      return [f(value), newState]
    })
  }

  /**
   * Transforms the value and state produced by this state transformation function using the given function.
   */
  mapBoth<U>(f: (result: [T, S]) => [U, S]): State<S, U> {
    return new State(state => f(this.run(state)))
  }

  /**
   * Chains this state transformation function with another function that takes the value produced by this function and returns a new {@link State} instance, allowing for sequential state transformations.
   */
  then<U>(f: (value: T) => State<S, U>): State<S, U> {
    return new State(state => {
      const [value, newState] = this.run(state)
      return f(value).run(newState)
    })
  }

  /**
   * Returns a new {@link State} instance that applies the given function to the state and returns the resulting value without modifying the state.
   */
  static gets<S, T>(f: (state: S) => T): State<S, T> {
    return new State(state => [f(state), state])
  }

  /**
   * Modifies the state using the given function before applying this state transformation function.
   */
  with(f: (state: S) => S): State<S, T> {
    return new State(state => this.run(f(state)))
  }
}
