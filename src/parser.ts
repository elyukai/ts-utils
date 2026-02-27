/**
 * A simple parser combinator.
 * @module
 */

/**
 * The type `ParserResult<T>` represents the result of parsing a string using a parser. It is an array of tuples, where each tuple contains a parsed element of type T and the remaining unparsed string. If the parser fails to parse the input according to the defined rules, it returns an empty array.
 */
export type ParserResult<T> = [parsed: T, remaining: string][]

/**
 * A class that serves as a parser combinator, allowing you to build complex parsers by combining simpler ones. The parser takes a string input and produces an array of tuples, where each tuple contains a parsed element of type T and the remaining unparsed string. If the parser fails to parse the input according to the defined rules, it returns an empty array.
 */
export class Parser<T> {
  /**
   * The function takes a syntax string and returns an array of tuples, where each tuple contains a parsed element of type T and the remaining unparsed string. An empty array is returned if the syntax string cannot be parsed according to the defined rules.
   */
  #fn: (syntax: string) => ParserResult<T>

  private constructor(fn: (syntax: string) => ParserResult<T>) {
    this.#fn = fn
  }

  /**
   * Parses a single character.
   */
  static item: Parser<string> = new Parser<string>((syntax) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we check for empty string before accessing the first character
    syntax.length === 0 ? [] : [[syntax[0]!, syntax.slice(1)]],
  )

  /**
   * Returns a parser that always succeeds with the given element, without consuming any input.
   */
  static of<T>(element: T): Parser<T> {
    return new Parser((syntax) => [[element, syntax]])
  }

  /**
   * Returns a parser that applies the given function to the syntax string if it is not empty, and returns an empty array if the syntax string is empty.
   *
   * Apart from this safeguard, it behaves exactly like the given function.
   */
  static nonEmpty<T>(f: (syntax: string) => ParserResult<T>): Parser<T> {
    return new Parser((syntax) => (syntax.length === 0 ? [] : f(syntax)))
  }

  /**
   * Chains this parser with another parser that depends on the result of this parser.
   */
  then<U>(f: (result: T) => Parser<U>): Parser<U> {
    return new Parser((syntax) =>
      this.#fn(syntax).flatMap(([result, remaining]) =>
        f(result).#fn(remaining),
      ),
    )
  }

  /**
   * A parser that always fails.
   */
  static zero = new Parser<never>(() => [])

  /**
   * Combines this parser with another parser, trying this parser first and then the other parser.
   */
  or(other: Parser<T>): Parser<T> {
    return new Parser((syntax) => [...this.#fn(syntax), ...other.#fn(syntax)])
  }

  /**
   * Combines this parser with another parser, trying this parser first and then the other parser only if the first parser fails. It only returns the first successful result.
   */
  orFirst(other: Parser<T>): Parser<T> {
    return new Parser((syntax) => {
      const result = this.#fn(syntax)
      return result.length > 0
        ? result.slice(0, 1)
        : other.#fn(syntax).slice(0, 1)
    })
  }

  /**
   * Returns a parser that parses a character that satisfies the given predicate function.
   */
  static satisfy<C extends string>(
    predicate: (character: string) => character is C,
  ): Parser<C>
  static satisfy(predicate: (character: string) => boolean): Parser<string>
  static satisfy(predicate: (character: string) => boolean): Parser<string> {
    return Parser.item.then((char) =>
      predicate(char) ? Parser.of(char) : Parser.zero,
    )
  }

  /**
   * Returns a parser that parses a specific string.
   */
  static string<T extends string>(string: T): Parser<T> {
    return new Parser((syntax) =>
      syntax.startsWith(string)
        ? [[syntax.slice(0, string.length) as T, syntax.slice(string.length)]]
        : [],
    )
  }

  /**
   * Returns a parser that parses zero or more occurrences of this parser, returning an array of the parsed results.
   */
  many(): Parser<T[]> {
    return this.many1().orFirst(Parser.of([]))
  }

  /**
   * Returns a parser that parses one or more occurrences of this parser, returning an array of the parsed results.
   *
   * It fails if this parser does not succeed at least once.
   */
  many1(): Parser<T[]> {
    return this.then((result) =>
      this.many().then((results) => Parser.of([result, ...results])),
    )
  }

  /**
   * Returns a parser that parses zero or more occurrences of this parser, separated by another parser, returning an array of the parsed results.
   */
  separatedBy(separator: Parser<unknown>): Parser<T[]> {
    return this.separatedBy1(separator).orFirst(Parser.of([]))
  }

  /**
   * Returns a parser that parses one or more occurrences of this parser, separated by another parser, returning an array of the parsed results.
   *
   * It fails if this parser does not succeed at least once.
   */
  separatedBy1(separator: Parser<unknown>): Parser<T[]> {
    return this.then((result) =>
      separator
        .then(() => this)
        .many()
        .then((results) => Parser.of([result, ...results])),
    )
  }

  /**
   * A parser that parse sone or more whitepace characters.
   */
  static space: Parser<string> = (() => {
    const spacePattern = /^\s*/u
    return new Parser((syntax) => {
      const result = spacePattern.exec(syntax)
      return result === null
        ? []
        : [[result[0], syntax.slice(result[0].length)]]
    })
  })()

  /**
   * Throws away leading whitespace characters before applying the given parser.
   */
  static token<T>(parser: Parser<T>): Parser<T> {
    return parser.then((result) => Parser.space.then(() => Parser.of(result)))
  }

  /**
   * Returns a parser that parses a specific string, ignoring leading whitespace characters.
   */
  static symbolicToken<T extends string>(symbol: T): Parser<T> {
    return Parser.token(Parser.string(symbol))
  }

  /**
   * Runs the parser on the given syntax string.
   *
   * A complete parse is one where the remaining unparsed string is empty. However, this method does not enforce that, and it will return all possible parses, including those that do not consume the entire input.
   */
  parse(syntax: string): ParserResult<T> {
    return this.#fn(syntax)
  }
}
