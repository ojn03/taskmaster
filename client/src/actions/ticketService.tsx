"use server";
// import typia from "typia";
import { base } from "@/actions/host";

type Ticket = {
  tick_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  proj_id: number;
  user_id: number;
};

export async function getTicket({ tick_id }: { tick_id: number }) {
  return await getAssert<Ticket>(`ticket/${tick_id}`);
}

async function getAssert<T>(route: string) {
  return await fetch(`${base}/${route}`).then((res) => res.json());
}
