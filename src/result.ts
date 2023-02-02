import { Option } from "./option";

/**
 * A wrapper that represents either a value of type T or an error of type E
 */
export abstract class Result<T, E> {
  /** Wrap val in Ok */
  static ok<T, E>(val: T): Result<T, E> {
    return new Ok<T, E>(val);
  }

  /** Wrap val in Err */
  static error<T, E>(val: E): Result<T, E> {
    return new Err<T, E>(val);
  }

  /** 
   * Run a function catching any errors and wrapping them in a result 
   * @param fn the function that you'd like to catch any errors from
   */
  static wrap<T, E>(fn: () => T): Result<T, E> {
    try {
      return new Ok(fn());
    } catch (ex) {
      return new Err(ex as E);
    }
  }
  
  /**
   * Create a function that can wrap any other function that returns `T` in a Result<T, E>
   */
  static createFnWrapper<E>() {
    return <T, Args extends Array<any>>(fn: (...args: Args) => T) =>
      Result.wrapFn<T, E, Args>(fn);
  }
  
  /**
   * Wrap a function so that it returns a Result<T, E> instead of throwing an error.
   * If you only want to specify E, use createFnWrapper to generate a function wrapper first
   *
   * @param fn the function you want to wrap
   */
  static wrapFn<T, E, Args extends Array<any>>(
    fn: (...args: Args) => T
  ): (...args: Args) => Result<T, E> {
    return (...args: Args) => Result.wrap(() => fn(...args));
  }

  /**
   * Like the wrap function but takes an async function or a promise as input
   * and returns a Result wrapped in a promise
   * @param fn The promise or async function you want to wrap
   */
  static async wrapPromise<T, E>(
    fn: (() => Promise<T>) | Promise<T>
  ): Promise<Result<T, E>> {
    try {
      return new Ok(await (fn instanceof Function ? fn() : fn));
    } catch (ex) {
      return Promise.resolve(new Err(ex));
    }
  }

  /**
   * Unwrap the underling result.
   * @throws The error value if present
   */
  abstract unwrap(): T;

  /**
   * Attempt to get the underling value, but if there is an error, return the
   * default value. If this computation is expensive, use unwrapOrElse for lazy
   * evaluation instead
   * @param value The default value to use incas of an error
   */
  abstract unwrapOr(value: T): T;

  /**
   * Attempt to get the underling value, but if there is an error, return the
   * error
   * @param fn The function to call to get the value, error is the default value
   */
  abstract unwrapOrElse(fn: (error: E) => T): T;

  /**
   * If there is a value, return Some, if there is an error return None
   */
  abstract ok(): Option<T>;

  /**
   * If there is a error, return Some, if there is an value return None
   */
  abstract err(): Option<E>;

  /**
   * Map a value to a another value
   * @param fn The function to transform a value of type T to a value of type U
   */
  abstract map<U>(fn: (value: T) => U): Result<U, E>;

  /**
   * Map an error to another error
   * @param fn The function to transform an error of type E to a error of type U
   */
  abstract mapErr<U>(fn: (error: E) => U): Result<T, U>;

  /**
   * Map a value to a new result
   * @param fn The function to transform a value of type T to a result of type
   *     Result<U, E>
   */
  abstract then<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * Map an error to a new result
   * @param fn The function to transform a value of type T to a result of type
   *     Result<U, E>
   */
  abstract or<U>(value: Result<T, U>): Result<T, U>;

  /**
   * Map an error to a new result
   * @param fn The function to transform a value of type T to a result of type
   *     Result<U, E>
   */
  abstract orElse<U>(fn: (error: E) => Result<T, U>): Result<T, U>;

  /**
   * Returns weather or not the object is an error
   */
  abstract isError(): boolean;

  /**
   * Returns weather or not the object is a value
   */
  abstract isValue(): boolean;
}

class Ok<T, E> extends Result<T, E> {
  constructor(private value: T) {
    super();
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(): T {
    return this.value;
  }

  unwrapOrElse(): T {
    return this.value;
  }

  ok(): Option<T> {
    return Option.from(this.value);
  }

  err(): Option<E> {
    return Option.none();
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Ok(fn(this.value));
  }

  mapErr<U>(): Result<T, U> {
    return new Ok(this.value);
  }

  then<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  or<U>(): Result<T, U> {
    return this as unknown as Result<T, U>;
  }

  orElse<U>(): Result<T, U> {
    return this as unknown as Result<T, U>;
  }

  isError(): boolean {
    return false;
  }

  isValue(): boolean {
    return true;
  }
}

class Err<T, E> extends Result<T, E> {
  constructor(private value: E) {
    super();
  }

  unwrap(): T {
    throw this.value;
  }

  unwrapOr(value: T): T {
    return value;
  }

  unwrapOrElse(fn: (error: E) => T): T {
    return fn(this.value);
  }

  ok(): Option<T> {
    return Option.none();
  }

  err(): Option<E> {
    return Option.from(this.value);
  }

  map<U>(): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  mapErr<U>(fn: (error: E) => U): Result<T, U> {
    return new Err(fn(this.value));
  }

  then<U>(): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  or<U>(value: Result<T, U>): Result<T, U> {
    return value;
  }

  orElse<U>(fn: (error: E) => Result<T, U>): Result<T, U> {
    return fn(this.value);
  }

  isError(): boolean {
    return true;
  }

  isValue(): boolean {
    return false;
  }
}
