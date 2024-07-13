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
