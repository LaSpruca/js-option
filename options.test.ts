import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { Option } from "./options.ts";

Deno.test(function testUnwrap() {
  const someVal = Option.from("Hello world");
  const noneVal = Option.none<string>();

  // Raw unwraps
  assertEquals(someVal.unwrap(), "Hello world");
  assertThrows(noneVal.unwrap);

  // Unwrap or
  assertEquals(someVal.unwrapOr("Goodbye world"), "Hello world");
  assertEquals(noneVal.unwrapOr("Goodbye world"), "Goodbye world");

  // Unwrap or else
  assertEquals(someVal.unwrapOr("Goodbye world"), "Hello world");
  assertEquals(noneVal.unwrapOr("Goodbye world"), "Goodbye world");
});

Deno.test(function testMap() {
  const someVal = Option.from("Hello world");

  assertEquals(someVal.map((f) => f.length).unwrap(), 11);

  const noneVal = Option.none<string>();

  assertThrows(noneVal.map((f) => f.length).unwrap);
});

Deno.test(function testOr() {
  const someVal = Option.from("Hello world");
  const goodbyeWorld = Option.from("Goodbye world");
  const noneVal = Option.none<string>();

  assertEquals(someVal.or(goodbyeWorld).unwrap(), "Hello world");
  assertEquals(noneVal.or(goodbyeWorld).unwrap(), "Goodbye world");
  assertThrows(noneVal.or(Option.none()).unwrap);

  assertEquals(someVal.orElse(() => goodbyeWorld).unwrap(), "Hello world");
  assertEquals(noneVal.orElse(() => goodbyeWorld).unwrap(), "Goodbye world");
  assertThrows(noneVal.orElse(() => Option.none()).unwrap);
});

Deno.test(function testThen() {
  const someVal = Option.from("Hello world");
  const goodbyeWorld = Option.from("Goodbye world");
  const noneVal = Option.none<string>();
  const fn = (x: string) => (x == "Hello world" ? goodbyeWorld : Option.none());

  assertEquals(someVal.then(fn).unwrap(), "Goodbye world");
  assertThrows(goodbyeWorld.then(fn).unwrap);
  assertThrows(noneVal.then(fn).unwrap);
});
