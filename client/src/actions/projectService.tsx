"use server";
import { Project } from "./types";
import { base } from "@/actions/host";

export async function getProjectMembers({ projid }: { projid: number }) {
  const res = await fetch(`${base}/projects/${projid}/users`);
}

export async function getProjectTickets({ projid }: { projid: number }) {
  // add typing
  const res = await fetch(`${base}/projects/${projid}/tickets`);
}

export async function getProjectInfo({
  projid,
}: {
  projid: number;
}): Promise<Project> {
  const res = await fetch(`${base}/projects/${projid}`);
  return await res.json();
}
