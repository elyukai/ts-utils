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

  /**
   * Returns a parser that applies the given function to the syntax string if it is not empty.
   */
  constructor(fn: (syntax: string) => ParserResult<T>) {
    this.#fn = fn
  }

  /**
   * Parses a single character.
   */
  static item: Parser<string> = new Parser<string>(syntax =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we check for empty string before accessing the first character
    syntax.length === 0 ? [] : [[syntax[0]!, syntax.slice(1)]],
  )

  /**
   * Returns a parser that always succeeds with the given element, without consuming any input.
   */
  static of<T>(element: T): Parser<T> {
    return new Parser(syntax => [[element, syntax]])
  }

  /**
   * Transforms the result of this parser using the given function, without consuming any additional input.
   */
  map<U>(f: (result: T) => U): Parser<U> {
    return new Parser(syntax =>
      this.#fn(syntax).map(([result, remaining]) => [f(result), remaining]),
    )
  }

  /**
   * Chains this parser with another parser that depends on the result of this parser.
   */
  then<U>(f: (result: T) => Parser<U>): Parser<U> {
    return new Parser(syntax =>
      this.#fn(syntax).flatMap(([result, remaining]) => f(result).#fn(remaining)),
    )
  }

  /**
   * A parser that always fails.
   */
  static zero: Parser<never> = new Parser<never>(() => [])

  /**
   * Combines this parser with another parser, trying this parser first and then the other parser.
   */
  or(other: Parser<T>): Parser<T> {
    return new Parser(syntax => [...this.#fn(syntax), ...other.#fn(syntax)])
  }

  /**
   * Combines this parser with another parser, trying this parser first and then the other parser only if the first parser fails. It only returns the first successful result.
   */
  orFirst(other: Parser<T>): Parser<T> {
    return new Parser(syntax => {
      const result = this.#fn(syntax)
      return result.length > 0 ? result.slice(0, 1) : other.#fn(syntax).slice(0, 1)
    })
  }

  /**
   * Combines this parser with another parser, trying this parser first and then the other parser only if the first parser fails. It only returns the first successful result.
   *
   * The suffix ‘W’ stands for ‘widening’, as this method allows you to combine parsers with different result types.
   */
  orFirstW<U>(other: Parser<U>): Parser<T | U> {
    return new Parser((syntax): ParserResult<T | U> => {
      const result = this.#fn(syntax)
      return result.length > 0 ? result.slice(0, 1) : other.#fn(syntax).slice(0, 1)
    })
  }

  /**
   * Returns a parser that tries this parser and returns its result if it succeeds, but if this parser fails, it returns a parser that always succeeds with `undefined` without consuming any input.
   */
  optional(): Parser<T | undefined> {
    return this.orFirstW(Parser.of(undefined))
  }

  /**
   * Returns a parser that parses a character that satisfies the given predicate function.
   */
  static satisfy<C extends string>(predicate: (character: string) => character is C): Parser<C>
  static satisfy(predicate: (character: string) => boolean): Parser<string>
  static satisfy(predicate: (character: string) => boolean): Parser<string> {
    return Parser.item.then(char => (predicate(char) ? Parser.of(char) : Parser.zero))
  }

  /**
   * Returns a parser that parses a specific string.
   */
  static string<T extends string>(string: T): Parser<T> {
    return new Parser(syntax =>
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
    return this.then(result => this.many().then(results => Parser.of([result, ...results])))
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
    return this.then(result =>
      separator
        .then(() => this)
        .many()
        .then(results => Parser.of([result, ...results])),
    )
  }

  /**
   * Returns a parser that parses a string that matches the given regular expression pattern.
   *
   * The pattern must match at the beginning of the string (patterns that are designed like this might perform better), and the parser will return the matched substring as the parsed result.
   */
  static regex(pattern: RegExp): Parser<string> {
    return new Parser(syntax => {
      const result = pattern.exec(syntax)
      // checks for no match and not a match at the beginning of the string at the same time
      return result?.index !== 0 ? [] : [[result[0], syntax.slice(result[0].length)]]
    })
  }

  /**
   * A parser that parses whitepace characters.
   */
  static space: Parser<string> = Parser.regex(/^\s*/)

  /**
   * A parser that parses horizontal whitepace characters.
   *
   * This can be useful for parsing a language where newlines are significant.
   */
  static hspace: Parser<string> = Parser.regex(/^[^\S\r\n]*/)

  /**
   * Throws away trailing whitespace characters before applying the given parser.
   */
  token(): Parser<T> {
    return this.then(result => Parser.space.then(() => Parser.of(result)))
  }

  /**
   * Throws away trailing horizontal whitespace characters before applying the given parser.
   *
   * This can be useful for parsing a language where newlines are significant.
   */
  htoken(): Parser<T> {
    return this.then(result => Parser.hspace.then(() => Parser.of(result)))
  }

  /**
   * Returns a parser that parses a specific string, ignoring trailing whitespace characters.
   */
  static symb<T extends string>(symbol: T): Parser<T> {
    return Parser.string(symbol).token()
  }

  /**
   * Returns a parser that parses a specific string, ignoring trailing horizontal whitespace characters.
   *
   * This can be useful for parsing a language where newlines are significant.
   */
  static hsymb<T extends string>(symbol: T): Parser<T> {
    return Parser.string(symbol).htoken()
  }

  /**
   * Creates a parser that parses a value using the given parser, surrounded by the given left and right parsers, and returns the parsed value.
   */
  between<L, R>(left: Parser<L>, right: Parser<R>): Parser<T> {
    return left.then(() => this).then(result => right.then(() => Parser.of(result)))
  }

  /**
   * Returns a parser that applies the given parser to the input string without consuming any input, returning the result of the parser if it succeeds. If the parser fails, this lookahead parser also fails.
   */
  static lookahead<T>(parser: Parser<T>): Parser<T> {
    return new Parser(syntax => {
      const result = parser.parse(syntax)[0]
      return result !== undefined ? [[result[0], syntax]] : []
    })
  }

  /**
   * Returns a parser that applies the given parser to the input string without consuming any input, returning `undefined` if it fails. If the parser succeeds, this fails instead.
   */
  static negativeLookahead(parser: Parser<unknown>): Parser<undefined> {
    return new Parser(syntax => {
      const result = parser.parse(syntax)[0]
      return result === undefined ? [[undefined, syntax]] : []
    })
  }

  /**
   * Runs the parser on the given syntax string, ignoring any leading whitespace.
   *
   * A complete parse is one where the remaining unparsed string is empty. However, this method does not enforce that, and it will return all possible parses, including those that do not consume the entire input.
   */
  apply(syntax: string): ParserResult<T> {
    return Parser.space.then(() => this).parse(syntax)
  }

  /**
   * Runs the parser on the given syntax string.
   *
   * A complete parse is one where the remaining unparsed string is empty. However, this method does not enforce that, and it will return all possible parses, including those that do not consume the entire input.
   */
  parse(syntax: string): ParserResult<T> {
    return this.#fn(syntax)
  }

  static debugLog<T>(parser: Parser<T>): Parser<T> {
    return new Parser<T>(syntax => {
      console.log("Parsing:", syntax)
      const results = parser.parse(syntax)
      console.log(results)
      return results
    })
  }
}
