"use server";
import { getAssert } from "@/lib/serverUtils";
import { Project, User } from "../lib/schemas";

export const getUser = async (user_id: number): Promise<User> => {
  const data = await getAssert<User>({
    route: `users/${user_id}`,
    schemas: User,
  });

  return data;
};

export const getProjects = async ({ userid }: { userid: number }) => {
  const data = await getAssert<Project[]>({
    route: `users/${userid}/projects`,
    schemas: Project,
    isArray: true,
  });

  return data;
};
