import { type ClassValue, clsx } from "clsx";
import { assert, is } from "tsafe";
import { twMerge } from "tailwind-merge";
import { Value } from "@sinclair/typebox/value";
import { TSchema } from "@sinclair/typebox";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;

  let stringified = "[Unable to stringify the thrown value]";
  try {
    stringified = JSON.stringify(value);
  } catch {}

  const error = new Error(
    `This value was thrown as is, not through an Error: ${stringified}`,
  );
  return error;
}

type IfEquals<X, Y, t = unknown, N = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? t : N;

export declare const exactType: <T, U>(
  draft: T & IfEquals<T, U>,
  expected: U & IfEquals<T, U>,
) => IfEquals<T, U>;

export function assertIs<T>(schema: TSchema, data: unknown): asserts data is T {
  //TODO add error message
  assert(Value.Check(schema, data));
}
