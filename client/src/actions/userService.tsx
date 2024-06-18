"use server";
import { revalidatePath } from "next/cache";

type User = {
  user_id: number;
  first: string;
  last: string;
  email: string;
};

const base = process.env.NEXT_API_BASE || "http://localhost:5001";

export const getUser = async (user_id: number): Promise<User> => {
  const res = await fetch(`${base}/users/${user_id}`);
  //TODO validate response schema
  return await res.json();
};
