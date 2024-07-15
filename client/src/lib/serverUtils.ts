import { TSchema } from "@sinclair/typebox";
import { assertIs } from "./utils";
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
    ...options,
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.status + " " + res.statusText);
    }
  });
}

export async function fetchWithRetry(input: RequestInfo, init?: RequestInit) {
  let response = await fetch(`${base}/${input}`);
  if (response.status === 401) {
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
    response = await fetch(`${base}/${input}`, init);
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
    ...options,
  };
  return await fetchWithRetry(`${base}/${route}`, postoptions).then((res) => {
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    const cookies = res.headers.getSetCookie();
    cookies.forEach((cookie) => {
      console.log("a split");
      console.log(cookie.split(";"));
    });
    console.log(cookies);

    console.log(res.headers.getSetCookie()[0]);

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
  const data = await get(route, options);
  assertIs<T>(schemas, data, isArray);
  return data;
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
