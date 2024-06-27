import { type ClassValue, clsx } from "clsx";
import { assert, is } from "tsafe";
import { twMerge } from "tailwind-merge";
import { Value } from "@sinclair/typebox/value";
import { TSchema, Type } from "@sinclair/typebox";
import { base } from "@/actions/host";

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
  schema: TSchema,
  data: unknown,
  //if isArray is true, the data is expected to be an array of the given schema
  isArray = false,
): asserts data is T {
  //TODO add error message
  const valid = isArray
    ? Value.Check(Type.Array(schema), data)
    : Value.Check(schema, data);
  assert(valid);
} //TODO fix caching

export async function get({ route }: { route: string }) {
  try {
    const response = await fetch(`${base}/${route}`, {
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function getAssert<T>({
  route,
  schema,
  isArray = false,
}: {
  route: string;
  schema: TSchema;
  isArray?: boolean;
}): Promise<T> {
  const data =
    // get({ route });

    await fetch(`${base}/${route}`, { cache: "no-store" }).then((res) => {
      if (!res.ok) {
        throw new Error(res.status + " " + res.statusText);
      }
      return res.json();
    });
  assertIs<T>(schema, data, isArray);
  return data;
}
