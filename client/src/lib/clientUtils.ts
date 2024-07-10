"use client";
import { SessionStore } from "@/store";
import { TSchema } from "@sinclair/typebox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assertIs, get, post } from "./serverUtils";

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
};

function getHeaders() {
  const { access_token } = SessionStore.getState();
  const bearer = access_token && { Authorization: `Bearer ${access_token}` };
  console.log("bearer:", bearer);
  const headers = {
    // Accept: "application/json",
    "Content-Type": "application/json",
    ...bearer,
  };
  return headers;
}

//injects headers from client side state before calling server side fetch
export async function clientGet({
  route,
  options,
}: {
  route: string;
  options?: RequestInit;
}): Promise<unknown> {
  const getOptions: RequestInit = {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
    ...options,
  };
  return await get(route, getOptions);
}
export async function clientPost({
  route,
  data,
  options,
}: {
  route: string;
  data?: Object;
  options?: RequestInit;
}): Promise<unknown> {
  const postOptions: RequestInit = {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
    cache: "no-store",
    ...options,
  };
  return await post({ route, options: postOptions });
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
  const data = await clientGet({ route, options });

  assertIs<T>(schemas, data, isArray);
  return data;
}
