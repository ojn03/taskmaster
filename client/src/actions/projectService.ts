"use server";
import * as schemas from "../lib/schemas";
import { get, getAssert } from "@/lib/utils";

type UserRole = schemas.User & schemas.Role;

export async function getProjectMembers({
  projid,
}: {
  projid: number;
}): Promise<UserRole[]> {
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

export async function getProjectUserTickets({
  projid,
  userid,
}: {
  projid: number;
  userid: number;
}): Promise<schemas.Ticket[]> {
  const data = await getAssert<schemas.Ticket[]>({
    route: `projects/${projid}/users/${userid}/tickets`,
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

export async function getHistory({
  projid,
}: {
  projid: number;
}): Promise<schemas.History[]> {
  const data = await getAssert<schemas.History[]>({
    route: `projects/${projid}/history`,
    schemas: schemas.History,
    isArray: true,
  });
  return data;
}

export async function getTeam({
  userid,
  projid,
}: {
  userid: number;
  projid: number;
}): Promise<UserRole[]> {
  const data = await getAssert<UserRole[]>({
    route: `projects/${projid}/users/${userid}/team`,
    schemas: [schemas.User, schemas.Role],
    isArray: true,
  });

  return data;
}
