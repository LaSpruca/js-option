export abstract class Result<T, E> {
  abstract unwrap(): T;
}
