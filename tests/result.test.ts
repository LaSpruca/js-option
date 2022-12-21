import { Result } from "../src/result";

test("Test unwrapping", () => {
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

test("Test function wrapping", () => {
  const ok = Result.wrap(() => "Ok");
  const err = Result.wrap(() => {
    throw new Error("Err");
  });

  expect(ok.ok().isSome()).toBeTruthy();
  expect(err.err().isSome()).toBeTruthy();

  expect(ok.err().isSome()).toBeFalsy();
  expect(err.ok().isSome()).toBeFalsy();
});

test("Test mapping", () => {
  const ok = Result.ok<string, string>("Ok");
  const err = Result.error<string, string>("Err");

  expect(ok.map((k) => k.length)).toStrictEqual(Result.ok(2));
  expect(err.map((k) => k.length)).toStrictEqual(Result.error("Err"));

  expect(ok.mapErr((k) => k.length)).toStrictEqual(Result.ok("Ok"));
  expect(err.mapErr((k) => k.length)).toStrictEqual(Result.error(3));
});

test("Test then", () => {
  const ok = Result.ok<string, string>("Ok");
  const err = Result.error<string, string>("Err");

  expect(ok.then((val) => Result.ok(val.length))).toStrictEqual(Result.ok(2));
  expect(err.then((val) => Result.ok(val.length))).toStrictEqual(
    Result.error("Err")
  );
});

test("Test or", () => {
  const ok = Result.ok<string, string>("Ok");
  const err = Result.error<string, string>("Err");

  expect(ok.or(Result.ok("Yep"))).toStrictEqual(Result.ok("Ok"));
  expect(err.or(Result.ok("Yep"))).toStrictEqual(Result.ok("Yep"));
});

test("Test orElse", () => {
  const ok = Result.ok<string, string>("Ok");
  const err = Result.error<string, string>("Err");
  expect(ok.orElse((ex) => Result.ok(ex))).toStrictEqual(Result.ok("Ok"));
  expect(err.orElse((ex) => Result.ok(ex))).toStrictEqual(Result.ok("Err"));
});
