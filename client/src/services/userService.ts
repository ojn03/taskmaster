import { getAssert } from "@/lib/utils";
import { Project, User, Ticket } from "../lib/schemas";

export const getUser = async (user_id: string): Promise<User> => {
  const data = await getAssert<User>({
    route: `users/${user_id}`,
    schemas: User,
  });

  return data;
};

export const getProjects = async ({ userid }: { userid: string }) => {
  const data = await getAssert<Project[]>({
    route: `users/${userid}/projects`,
    schemas: Project,
    isArray: true,
  });

  return data;
};

export const getTickets = async (userid: string) => {
  const data = await getAssert<Ticket[]>({
    route: `users/${userid}/tickets`,
    schemas: Ticket,
    isArray: true,
  });

  return data;
};
