# js-option

This library is quite simple, it exposes two type, `Option<T>` and `Result<T, E>`. These are the enum types that you'd find in a language like rust, and I find them really nice to work with, so I decided to implement JS version. There are two classes for each type. For options we have the `Some<T>` and `None` classes, and for results we have `Ok<T, E>` and `Err<T, E>`.

## Options

Options are used to wrap null values, and can be used like so

```ts
const takesOption = (val: Option<string>) => {};

let someValue = null;
let option = Option.from(someValue);

if (option.isNone()) {
  console.log("Oh no");
} else {
  console.log(option.unwrap());
}
```
