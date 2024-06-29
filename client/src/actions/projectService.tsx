"use server";
import * as schemas from "../lib/schemas";
import { getAssert } from "@/lib/utils";

type UserRole = schemas.User & schemas.Role;

export async function getProjectMembers({
  projid,
}: {
  projid: number;
}): Promise<UserRole[]> {
  type UserRole = schemas.User & schemas.Role;
  const data = await getAssert<UserRole[]>({
    route: `projects/${projid}/users`,
    schemas: [schemas.User, schemas.Role],
    isArray: true,
  });

  return data;
}

export async function getProjectTickets({
  projid,
}: {
  projid: number;
}): Promise<schemas.Ticket[]> {
  const data = await getAssert<schemas.Ticket[]>({
    route: `projects/${projid}/tickets`,
    schemas: schemas.Ticket,
    isArray: true,
  });
  return data;
}

export async function getProjectInfo({
  projid,
}: {
  projid: number;
}): Promise<schemas.Project[]> {
  const data = await getAssert<schemas.Project[]>({
    route: `projects/${projid}`,
    schemas: schemas.Project,
    isArray: true,
  });

  return await data;
}

export async function getProjectRoles({
  projid,
}: {
  projid: number;
}): Promise<schemas.Role[]> {
  const data = await getAssert<schemas.Role[]>({
    route: `projects/${projid}/roles`,
    schemas: schemas.Role,
    isArray: true,
  });

  return data;
}
