/**
 * A simple stateful parser combinator.
 * @module
 */

import { Parser } from "./parser.js"

/**
 * A class that combines the functionality of a parser with a state transformation function, allowing for more complex parsing scenarios where the parser can also manipulate some state during the parsing process.
 */
export class StateTParser<S, T> {
  #fn: (state: S) => Parser<[T, S]>

  private constructor(fn: (state: S) => Parser<[T, S]>) {
    this.#fn = fn
  }

  /**
   * Returns a new {@link StateTParser} instance that always succeeds with the given value while not modifying the state.
   */
  static of<S, T>(value: T): StateTParser<S, T> {
    return new StateTParser(state => Parser.of([value, state]))
  }

  /**
   * Chains the state transformation function and the parser with a function that takes the produced value and reutns a new {@link StateTParser} instance, allowing for sequential state transformations and parsing operations.
   */
  then<U>(f: (result: T) => StateTParser<S, U>): StateTParser<S, U> {
    return new StateTParser(state =>
      this.#fn(state).then(([result, newState]) => f(result).#fn(newState)),
    )
  }

  /**
   * Wraps a parser into a {@link StateTParser}, allowing the parser to be used in the context of state transformations.
   */
  static lift<S, T>(parser: Parser<T>): StateTParser<S, T> {
    return new StateTParser(state => parser.map(result => [result, state]))
  }

  /**
   * Applies the state transformation function to the given state and returns a tuple containing the resulting value and the new state.
   */
  runT(state: S): Parser<[T, S]> {
    return this.#fn(state)
  }

  /**
   * Applies the state transformation function to the given state and returns the resulting value, discarding the new state.
   */
  evalT(state: S): Parser<T> {
    return this.runT(state).map(result => result[0])
  }

  /**
   * Applies the state transformation function to the given state and returns the new state, discarding the resulting value.
   */
  execT(state: S): Parser<S> {
    return this.runT(state).map(result => result[1])
  }

  /**
   * Transforms the produced value using the given function, while keeping the state unchanged and not consuming any additional input.
   */
  map<U>(f: (value: T) => U): StateTParser<S, U> {
    return new StateTParser(state =>
      this.runT(state).map(([value, newState]) => [f(value), newState]),
    )
  }

  /**
   * Transforms the value and state produced by this state transformation function using the given function.
   */
  mapT<U>(f: (result: Parser<[T, S]>) => Parser<[U, S]>): StateTParser<S, U> {
    return new StateTParser(state => f(this.runT(state)))
  }

  /**
   * Returns a new {@link StateTParser} instance that returns the state as the resulting value without modifying the state.
   */
  static getT<S>(): StateTParser<S, S> {
    return new StateTParser(state => Parser.of([state, state]))
  }

  /**
   * Returns a new {@link StateTParser} instance that applies the given function to the state and returns the resulting value without modifying the state.
   */
  static getsT<S, T>(f: (state: S) => T): StateTParser<S, T> {
    return new StateTParser(state => Parser.of([f(state), state]))
  }

  /**
   * Modifies the state using the given function before applying this state transformation function.
   */
  withT(f: (state: S) => S): StateTParser<S, T> {
    return new StateTParser(state => this.runT(f(state)))
  }

  /**
   * Combines this parser with another parser, trying this parser first and then the other parser only if the first parser fails. It only returns the first successful result.
   */
  orFirst(other: StateTParser<S, T>): StateTParser<S, T> {
    return new StateTParser(state => {
      const parser = this.#fn(state)
      const otherParser = other.#fn(state)
      return parser.orFirst(otherParser)
    })
  }

  /**
   * Combines this parser with another parser, trying this parser first and then the other parser only if the first parser fails. It only returns the first successful result.
   *
   * The suffix ‘W’ stands for ‘widening’, as this method allows you to combine parsers with different result types.
   */
  orFirstW<U>(other: StateTParser<S, U>): StateTParser<S, T | U> {
    return new StateTParser<S, T | U>((state): Parser<[T, S] | [U, S]> => {
      const parser = this.#fn(state)
      const otherParser = other.#fn(state)
      return parser.orFirstW(otherParser)
    })
  }

  /**
   * Returns a parser that tries this parser and returns its result if it succeeds, but if this parser fails, it returns a parser that always succeeds with `undefined` without consuming any input.
   */
  optional(): StateTParser<S, T | undefined> {
    return this.orFirstW(StateTParser.of(undefined))
  }

  /**
   * Returns a parser that parses a specific string.
   */
  static string<S, T extends string = string>(string: T): StateTParser<S, T> {
    return StateTParser.lift(Parser.string(string))
  }

  /**
   * Returns a parser that parses zero or more occurrences of this parser, returning an array of the parsed results.
   */
  many(): StateTParser<S, T[]> {
    return this.many1().orFirst(StateTParser.of([]))
  }

  /**
   * Returns a parser that parses one or more occurrences of this parser, returning an array of the parsed results.
   *
   * It fails if this parser does not succeed at least once.
   */
  many1(): StateTParser<S, T[]> {
    return this.then(result => this.many().then(results => StateTParser.of([result, ...results])))
  }

  /**
   * Returns a parser that parses zero or more occurrences of this parser, separated by another parser, returning an array of the parsed results.
   */
  separatedBy(separator: StateTParser<S, unknown>): StateTParser<S, T[]> {
    return this.separatedBy1(separator).orFirst(StateTParser.of([]))
  }

  /**
   * Returns a parser that parses one or more occurrences of this parser, separated by another parser, returning an array of the parsed results.
   *
   * It fails if this parser does not succeed at least once.
   */
  separatedBy1(separator: StateTParser<S, unknown>): StateTParser<S, T[]> {
    return this.then(result =>
      separator
        .then(() => this)
        .many()
        .then(results => StateTParser.of([result, ...results])),
    )
  }

  /**
   * Returns a parser that parses a string that matches the given regular expression pattern.
   *
   * The pattern must match at the beginning of the string (patterns that are designed like this might perform better), and the parser will return the matched substring as the parsed result.
   */
  static regex<S>(pattern: RegExp): StateTParser<S, string> {
    return StateTParser.lift(Parser.regex(pattern))
  }

  /**
   * A parser that parses whitepace characters.
   */
  static space<S>(): StateTParser<S, string> {
    return StateTParser.lift(Parser.space)
  }

  /**
   * A parser that parses horizontal whitepace characters.
   *
   * This can be useful for parsing a language where newlines are significant.
   */
  static hspace<S>(): StateTParser<S, string> {
    return StateTParser.lift(Parser.hspace)
  }

  /**
   * Throws away trailing whitespace characters before applying the given parser.
   */
  token(): StateTParser<S, T> {
    return this.then(result => StateTParser.space<S>().then(() => StateTParser.of(result)))
  }

  /**
   * Throws away trailing horizontal whitespace characters before applying the given parser.
   *
   * This can be useful for parsing a language where newlines are significant.
   */
  htoken(): StateTParser<S, T> {
    return this.then(result => StateTParser.hspace<S>().then(() => StateTParser.of(result)))
  }

  /**
   * Returns a parser that parses a specific string, ignoring trailing whitespace characters.
   */
  static symb<S, T extends string>(symbol: T): StateTParser<S, T> {
    return StateTParser.string<S, T>(symbol).token()
  }

  /**
   * Returns a parser that parses a specific string, ignoring trailing horizontal whitespace characters.
   *
   * This can be useful for parsing a language where newlines are significant.
   */
  static hsymb<S, T extends string>(symbol: T): StateTParser<S, T> {
    return StateTParser.string<S, T>(symbol).htoken()
  }

  /**
   * Creates a parser that parses a value using the given parser, surrounded by the given left and right parsers, and returns the parsed value.
   */
  between<L, R>(left: StateTParser<S, L>, right: StateTParser<S, R>): StateTParser<S, T> {
    return left.then(() => this).then(result => right.then(() => StateTParser.of(result)))
  }

  /**
   * Returns a parser that applies the given parser to the input string without consuming any input, returning the result of the parser if it succeeds. If the parser fails, this lookahead parser also fails.
   */
  static lookahead<S, T>(parser: StateTParser<S, T>): StateTParser<S, T> {
    return new StateTParser(state => Parser.lookahead(parser.runT(state)))
  }

  /**
   * Returns a parser that applies the given parser to the input string without consuming any input, returning `undefined` if it fails. If the parser succeeds, this fails instead.
   */
  static negativeLookahead<S>(parser: StateTParser<S, unknown>): StateTParser<S, undefined> {
    return new StateTParser(state =>
      Parser.negativeLookahead(parser.runT(state)).map(() => [undefined, state]),
    )
  }

  static debugLog<S, T>(stateParser: StateTParser<S, T>): StateTParser<S, T> {
    return new StateTParser(state => {
      console.log("Parsing with state:", state)
      return Parser.debugLog(stateParser.runT(state))
    })
  }
}
