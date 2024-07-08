import { type ClassValue, clsx } from "clsx";
import { assert, is } from "tsafe";
import { twMerge } from "tailwind-merge";
import { Value } from "@sinclair/typebox/value";
import { Static, TSchema, Type } from "@sinclair/typebox";

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

export function assertIs<T>(
  schemas: TSchema | TSchema[],
  data: unknown,
  //if isArray is true, the data is expected to be an array of the given schema
  isArray = false,
): asserts data is T {
  //TODO for performance, call Value.Errors only if Value.check is false

  const schema = Array.isArray(schemas)
    ? Type.Composite(schemas, { additionalProperties: false })
    : schemas;

  const errors = isArray
    ? Value.Errors(Type.Array(schema), data)
    : Value.Errors(schema, data);

  const firstError = errors.First();

  assert(
    firstError === undefined,
    `error while validating schema ${schema.title && schema.title}: ${firstError?.message}`,
  );
} //TODO fix caching

export const base = process.env.NEXT_BASE || "http://localhost:5001";

export async function del(route: string): Promise<void> {
  return await fetch(`${base}/${route}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.status + " " + res.statusText);
    }
  });
}

export async function patch({
  route,
  body,
}: {
  route: string;
  body: Object;
}): Promise<unknown> {
  return await fetch(`${base}/${route}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.status + " " + res.statusText);
    }
  });
}

export async function post({
  route,
  data,
}: {
  route: string;
  data: Object;
}): Promise<unknown> {
  return await fetch(`${base}/${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  }).then((res) => {
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    return res.json();
  });
}

export async function get(route: string) {
  return await fetch(`${base}/${route}`, { cache: "no-store" }).then((res) => {
    if (!res.ok) {
      throw new Error(res.status + " " + res.statusText);
    }
    return res.json();
  });
}

export async function getAssert<T>({
  route,
  schemas,
  isArray = false,
}: {
  route: string;
  schemas: TSchema | TSchema[];
  isArray?: boolean;
}): Promise<T> {
  const data = await get(route);

  assertIs<T>(schemas, data, isArray);
  return data;
}
