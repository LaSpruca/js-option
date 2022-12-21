export class NoneValueError extends Error {
  constructor() {
    super("Attempted to unwrap None value");
    this.name = "NoneValueError";
  }
}

export abstract class Option<T> {
  /**
   * Get access to the underling value
   * @throws {NoneValueError} if the options is none
   */
  abstract unwrap(): T;
  /**
   * Safely unwrap an option, with a default value
   * @param defaultValue The value to be used in the case that the option is None, if this is expensive, please use unwrapOrElse for lazy computation
   */
  abstract unwrapOr(defaultValue: T): T;
  /**
   * Safely unwrap an option, with a function that returns the default value
   * @param defaultFn A function to be called incas of None
   */
  abstract unwrapOrElse(defaultFn: () => T): T;

  /**
   * Map a some value to a different some value
   * @param fn The function to be called
   */
  abstract map<U>(fn: (val: T) => U): Option<U>;

  /**
   * Map a some value to either a None or a new Some value that might have a different type
   * @param fn The mapping function
   */
  abstract then<U>(fn: (val: T) => Option<U>): Option<U>;

  /**
   * Map a None to either a None or a new Some value that might have a different type
   * @param fn The mapping function
   */
  abstract or(value: Option<T>): Option<T>;

  /**
   * Map a None to either a None or a new Some value that might have a different type
   * @param fn The mapping function
   */
  abstract orElse(fn: () => Option<T>): Option<T>;

  /**
   * Returns true if is some
   */
  abstract isSome(): boolean;

  /**
   * Returns true if is none
   */
  abstract isNone(): boolean;
}

export class Some<T> extends Option<T> {
  private value: T;
  constructor(value: T) {
    super();
    this.value = value;
  }

  unwrap() {
    return this.value;
  }

  unwrapOr(): T {
    return this.value;
  }

  unwrapOrElse(): T {
    return this.value;
  }

  map<U>(fn: (val: T) => U): Option<U> {
    return new Some(fn(this.value));
  }

  then<U>(fn: (val: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  or(): Option<T> {
    return this;
  }

  orElse(_fn: () => Option<T>): Option<T> {
    return this;
  }

  isSome(): boolean {
    return true;
  }

  isNone(): boolean {
    return false;
  }
}

export class None<T> extends Option<T> {
  constructor() {
    super();
  }

  unwrap() {
    throw new NoneValueError();
    // deno-lint-ignore no-unreachable
    return null as unknown as T;
  }

  unwrapOr(noneCase: T): T {
    return noneCase;
  }

  unwrapOrElse(noneCase: () => T): T {
    return noneCase();
  }

  map<U>(): Option<U> {
    return this as unknown as None<U>;
  }

  then<U>(): Option<U> {
    return this as unknown as None<U>;
  }

  or(value: Option<T>): Option<T> {
    return value;
  }

  orElse(fn: () => Option<T>): Option<T> {
    return fn();
  }

  isSome(): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }
}
