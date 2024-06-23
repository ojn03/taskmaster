"use server"

import { base } from "@/actions/host";

export async function getProjectMembers({ projid }: { projid: number }) {
  const res = await fetch(`${base}/projects/${projid}/users`);
}