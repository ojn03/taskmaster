"use server";
import { getAssert } from "@/lib/utils";
import { User } from "../lib/schemas";

export const getUser = async (user_id: number): Promise<User> => {
  const data = await getAssert<User>({
    route: `users/${user_id}`,
    schemas: User,
  });

  return data;
};
