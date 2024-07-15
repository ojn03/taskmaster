import { getAssert } from "@/lib/serverUtils";
import * as schemas from "../lib/schemas";

type UserRole = schemas.User & schemas.Role;

export async function getProjectMembers({
  projid,
}: {
  projid: string;
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
  projid: string;
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
  projid: string;
  userid: string;
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
  projid: string;
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
  projid: string;
}): Promise<schemas.Role[]> {
  const data = await getAssert<schemas.Role[]>({
    route: `projects/${projid}/roles`,
    schemas: schemas.Role,
    isArray: true,
  });

  return data;
}

//TODO fix history implementation
export async function getHistory({
  projid,
}: {
  projid: string;
}): Promise<schemas.History[]> {
  const data = await getAssert<schemas.History[]>({
    route: `projects/${projid}/history`,
    schemas: schemas.History,
    isArray: true,
  });
  return data;
}

export async function getTeamMembers({
  userid,
  projid,
}: {
  userid: string;
  projid: string;
}): Promise<UserRole[]> {
  const data = await getAssert<UserRole[]>({
    route: `projects/${projid}/users/${userid}/team`,
    schemas: [schemas.User, schemas.Role],
    isArray: true,
  });

  return data;
}

export async function getRoles({
  projid,
}: {
  projid: string;
}): Promise<schemas.Role[]> {
  const data = await getAssert<schemas.Role[]>({
    route: `projects/${projid}/roles`,
    schemas: schemas.Role,
    isArray: true,
  });

  return data;
}
