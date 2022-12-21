import { Option } from "./options.ts";

/**
 * A wrapper that represents either a value of type T or an error of type E
 */
export abstract class Result<T, E> {
  /**
   * Unwrap the underling result.
   * @throws The error value if present
   */
  abstract unwrap(): T;

  /**
   * Attempt to get the underling value, but if there is an error, return the default value. If this computation is expensive, use unwrapOrElse for lazy evaluation instead
   * @param value The default value to use incas of an error
   */
  abstract unwrapOr(value: T): T;

  /**
   * Attempt to get the underling value, but if there is an error, return the error
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
   * @param fn The function to transform a value of type T to a result of type Result<U, E>
   */
  abstract then<U>(fn: (value: T) => Result<U, E>): Result<U, T>;

  /**
   * Map an error to a new result
   * @param fn The function to transform a value of type T to a result of type Result<U, E>
   */
  abstract or<U>(value: Result<T, U>): Result<T, U>;

  /**
   * Map an error to a new result
   * @param fn The function to transform a value of type T to a result of type Result<U, E>
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
