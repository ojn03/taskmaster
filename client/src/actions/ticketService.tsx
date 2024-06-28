"use server";
// import typia from "typia";
import { base } from "@/actions/host";
import { Ticket } from "./schemas";
import assert from "assert";
import { Value } from "@sinclair/typebox/value";
import { getAssert } from "@/lib/utils";

export async function getTicket({
  tick_id,
}: {
  tick_id: number;
}): Promise<Ticket[]> {
  //TODO should not be returning an array
  const data = await getAssert<Ticket[]>({
    route: `tickets/${tick_id}`,
    schema: Ticket,
    isArray: true,
  });
  return data;
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
  return await fetch(`${base}/tickets/${tick_id}`, {
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
