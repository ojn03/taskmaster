"use server";
// import typia from "typia";
import { base } from "@/actions/host";

export async function getTicket({ tick_id }: { tick_id: number }) {
  return await getAssert<Ticket>(`ticket/${tick_id}`);
}

async function getAssert<T>(route: string) {
  return await fetch(`${base}/${route}`).then((res) => res.json());
}

export async function updateTicket({
  tick_id,
  ticket_title,
  ticket_description,
  ticket_progress,
}: {
  tick_id: number;
  ticket_title?: string;
  ticket_description?: string;
  ticket_progress?: number;
}) {
  return await fetch(`${base}/ticket/${tick_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticket_title,
      ticket_description,
      ticket_progress,
    }),
  });
}
