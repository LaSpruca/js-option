# js-option

The idea for this library was taken straight from Rust's result and option types. The provided types are accessible through the `Result` and `Option` types, with functions for creating the respective variants.

## Options

Options are used to wrap null values, and can be used like so

```ts
import { Option } from "js-options";

let someValue = null;
let option = Option.from(someValue);

option
  .map((val) => {
    console.log(val);
  })
  .orElse(() => {
    console.log("Oh no");
  });
```

## Results

Much like options, results can be used like the following:

```ts
import { Result } from "js-option";

const throws = () => {
  // Image some code
};

const result = Result.wrap(throws);

result
  .map((value) => {
    console.log("Aye it worked", value);
  })
  .mapErr((ex) => {
    console.log("Oh no", ex);
  });
```
