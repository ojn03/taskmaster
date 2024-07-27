import { TSchema, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { clsx, type ClassValue } from "clsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { twMerge } from "tailwind-merge";
import { assert } from "tsafe";

export const toastError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const toastSuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}; // import { cookies } from "next/headers";
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
export function assertIs<T>(
  schemas: TSchema | TSchema[],
  data: unknown,
  //if isArray is true, the data is expected to be an array of the given schema
  isArray = false,
): asserts data is T {
  const schema = Array.isArray(schemas)
    ? Type.Composite(schemas, { additionalProperties: false })
    : schemas;

  const check = isArray
    ? Value.Check(Type.Array(schema), data)
    : Value.Check(schema, data);

  let firstError = undefined;

  if (!check) {
    firstError = isArray
      ? Value.Errors(Type.Array(schema), data).First()
      : Value.Errors(schema, data).First();
  }

  assert(
    firstError === undefined,
    `error while validating schema ${firstError?.message}: with data: ${JSON.stringify(data)}`,
  );
} //TODO fix caching

const TIMEOUT_MS = 5000;
type IfEquals<X, Y, t = unknown, N = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? t : N;

export declare const exactType: <T, U>(
  draft: T & IfEquals<T, U>,
  expected: U & IfEquals<T, U>,
) => IfEquals<T, U>;
const base = process.env.NEXT_BASE || "http://localhost:5001";

export async function del(route: string): Promise<void> {
  return await fetchWithRetry(`${base}/${route}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.status + " " + res.statusText);
    }
  });
}
const baseHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function patch({
  route,
  body,
  options,
}: {
  route: string;
  body: Object;
  options?: RequestInit;
}): Promise<unknown> {
  return await fetchWithRetry(`${base}/${route}`, {
    method: "PATCH",
    headers: baseHeaders,
    body: JSON.stringify(body),
    cache: "no-store",
    credentials: "include",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    ...options,
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.status + " " + res.statusText);
    }
  });
}

export async function fetchWithRetry(input: string, init?: RequestInit) {
  let response = await fetch(input, init);
  if (response.status === 401 && !input.includes("/auth")) {
    //refresh token
    await fetch(`${base}/auth/refresh`, {
      method: "POST",
      headers: baseHeaders,
      credentials: "include",
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to refresh token");
      }
    });
    //retry original request
    response = await fetch(input, init);
  }
  return response;
}

export async function post({
  route,
  data,
  options,
}: {
  route: string;
  data?: Object;
  options?: RequestInit;
}): Promise<unknown> {
  const postoptions: RequestInit = {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify(data),
    cache: "no-store",
    credentials: "include",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    ...options,
  };
  return await fetchWithRetry(`${base}/${route}`, postoptions).then((res) => {
    if (!res.ok) throw new Error(res.status + " " + res.statusText);

    return res.json();
  });
}

export async function getAssert<T>({
  route,
  schemas,
  isArray = false,
  options,
}: {
  route: string;
  schemas: TSchema | TSchema[];
  isArray?: boolean;
  options?: RequestInit;
}): Promise<T> {
  try {
    const data = await get(route, options);
    assertIs<T>(schemas, data, isArray);
    console.log(`getAssert for route ${route} successful. data: `, data);
    return data;
  } catch (err) {
    console.error(`error in route ${route}`, err);
    return [] as T; //TODO fix this
  }
}

export async function get(
  route: string,
  options?: RequestInit,
): Promise<unknown> {
  const getOptions: RequestInit = {
    method: "GET",
    headers: baseHeaders,
    cache: "no-store",
    credentials: "include",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    ...options,
  };
  return await fetchWithRetry(`${base}/${route}`, getOptions).then(
    async (res) => {
      if (!res.ok) {
        throw new Error(res.status + " " + res.statusText);
      }
      const data = await res.json();
      return data;
    },
  );
}
