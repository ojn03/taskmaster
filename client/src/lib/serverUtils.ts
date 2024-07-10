import { TSchema, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { assert } from "tsafe";

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
    `error while validating schema ${schema.title && schema.title}: ${firstError?.message}: with data: ${JSON.stringify(data)}`,
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

//TODO creat client patch to inject headers
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
  options,
}: {
  route: string;
  options: RequestInit;
}): Promise<unknown> {
  console.log("server post options:", options);
  console.log("server post route:", route);
  return await fetch(`${base}/${route}`, options).then(async (res) => {
    if (!res.ok) {
      console.log("post res not ok");
      throw new Error(res.status + " " + res.statusText);
    }
    const data = await res.json();
    console.log("post res ok");
    console.log("post res data: ", data);
    return data;
  });
}

export async function get(
  route: string,
  options: RequestInit,
): Promise<unknown> {
  console.log("server get options:", options);
  console.log("server get route:", route);
  return await fetch(`${base}/${route}`, options).then(async (res) => {
    if (!res.ok) {
      console.log("get res not ok");
      throw new Error(res.status + " " + res.statusText);
    }
    const data = await res.json();
    console.log("get res ok");
    console.log(`get res data for route ${base}/${route}:`, data);
    return data;
  });
}
