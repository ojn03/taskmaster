"use server";
import { exactType } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const base = process.env.NEXT_API_BASE || "http://localhost:5001";

export const getUser = async (user_id: number): Promise<User> => {
  const res = await fetch(`${base}/users/${user_id}`);
  //TODO validate response schema
  const data = await res.json();

  type tdata = typeof data;
  if (!exactType(tdata, User)) {
    throw new Error("Invalid response schema");
  }
  return data;
};
