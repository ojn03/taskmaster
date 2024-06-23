"use server";
// import typia from "typia";
import { base } from "@/actions/host";


export async function getTicket({ tick_id }: { tick_id: number }) {
  return await getAssert<Ticket>(`ticket/${tick_id}`);
}

async function getAssert<T>(route: string) {
  return await fetch(`${base}/${route}`).then((res) => res.json());
}
