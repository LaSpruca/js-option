import { Result } from "../src";

it("Test wrapping async", () => {
  const fn = async (input?: unknown) => {
    if (input instanceof Number) {
      return input;
    } else {
      throw new Error("Hay this ain't right!");
    }
  }

  expect(Result.wrapPromise(fn(2))).resolves.toStrictEqual(Result.ok(2));
  expect(Result.wrapPromise(fn)).resolves.toStrictEqual(Result.error(new Error("Hay this ain't right")));
});

it("Test unwrapping", () => {
  const ok = Result.ok("Ok");
  const err = Result.error(new Error("Err"));

  expect(ok.unwrap()).toBe("Ok");
  expect(() => err.unwrap()).toThrow("Err");

  expect(ok.unwrapOr("Err")).toBe("Ok");
  expect(err.unwrapOr("Err")).toBe("Err");

  expect(ok.unwrapOrElse(() => "Err")).toBe("Ok");
  expect(err.unwrapOrElse(() => "Err")).toBe("Err");

  expect(ok.isError()).toBeFalsy();
  expect(ok.isValue()).toBeTruthy();

  expect(err.isError()).toBeTruthy();
  expect(err.isValue()).toBeFalsy();
});

it("Test function wrapping", () => {
  const ok = Result.wrap(() => "Ok");
  const err = Result.wrap(() => {
    throw new Error("Err");
  });

  expect(ok.ok().isSome()).toBeTruthy();
  expect(err.err().isSome()).toBeTruthy();

  expect(ok.err().isSome()).toBeFalsy();
  expect(err.ok().isSome()).toBeFalsy();
});

it("Test mapping", () => {
  const ok = Result.ok<string, string>("Ok");
  const err = Result.error<string, string>("Err");

  expect(ok.map((k) => k.length)).toStrictEqual(Result.ok(2));
  expect(err.map((k) => k.length)).toStrictEqual(Result.error("Err"));

  expect(ok.mapErr((k) => k.length)).toStrictEqual(Result.ok("Ok"));
  expect(err.mapErr((k) => k.length)).toStrictEqual(Result.error(3));
});

it("Test then", () => {
  const ok = Result.ok<string, string>("Ok");
  const err = Result.error<string, string>("Err");

  expect(ok.then((val) => Result.ok(val.length))).toStrictEqual(Result.ok(2));
  expect(err.then((val) => Result.ok(val.length))).toStrictEqual(
    Result.error("Err")
  );
});

it("Test or", () => {
  const ok = Result.ok<string, string>("Ok");
  const err = Result.error<string, string>("Err");

  expect(ok.or(Result.ok("Yep"))).toStrictEqual(Result.ok("Ok"));
  expect(err.or(Result.ok("Yep"))).toStrictEqual(Result.ok("Yep"));
});

it("Test orElse", () => {
  const ok = Result.ok<string, string>("Ok");
  const err = Result.error<string, string>("Err");
  expect(ok.orElse((ex) => Result.ok(ex))).toStrictEqual(Result.ok("Ok"));
  expect(err.orElse((ex) => Result.ok(ex))).toStrictEqual(Result.ok("Err"));
});
