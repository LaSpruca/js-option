import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { Some, None, type Option } from "./options.ts";

Deno.test(function testUnwrap() {
  const someVal: Option<string> = new Some("Hello world");
  const noneVal: Option<string> = new None();

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
  const someVal: Option<string> = new Some("Hello world");

  assertEquals(someVal.map((f) => f.length).unwrap(), 11);

  const noneVal: Option<string> = new None();

  assertThrows(noneVal.map((f) => f.length).unwrap);
});

Deno.test(function testOr() {
  const someVal: Option<string> = new Some("Hello world");
  const goodbyeWorld: Option<string> = new Some("Goodbye world");
  const noneVal: Option<string> = new None();

  assertEquals(someVal.or(goodbyeWorld).unwrap(), "Hello world");
  assertEquals(noneVal.or(goodbyeWorld).unwrap(), "Goodbye world");
  assertThrows(noneVal.or(new None()).unwrap);

  assertEquals(someVal.orElse(() => goodbyeWorld).unwrap(), "Hello world");
  assertEquals(noneVal.orElse(() => goodbyeWorld).unwrap(), "Goodbye world");
  assertThrows(noneVal.orElse(() => new None()).unwrap);
});

Deno.test(function testThen() {
  const someVal: Option<string> = new Some("Hello world");
  const goodbyeWorld: Option<string> = new Some("Goodbye world");
  const noneVal: Option<string> = new None();
  const fn = (x: string) => (x == "Hello world" ? goodbyeWorld : new None());

  assertEquals(someVal.then(fn).unwrap(), "Goodbye world");
  assertThrows(goodbyeWorld.then(fn).unwrap);
  assertThrows(noneVal.then(fn).unwrap);
});
