"use server";
import { assertIs, exactType } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { type Equals, assert, is } from "tsafe";
import { User } from "./types";

const base = process.env.NEXT_API_BASE || "http://localhost:5001";

export const getUser = async (user_id: number): Promise<User> => {
  const res = await fetch(`${base}/users/${user_id}`);
  //TODO validate response schema
  const data = await res.json();

  // assertIs<User>(data);

  return data;
};
