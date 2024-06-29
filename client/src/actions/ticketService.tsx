"use server";
// import typia from "typia";
import { base } from "@/actions/host";
import { AtLeast, Ticket } from "./schemas";
import assert from "assert";
import { Value } from "@sinclair/typebox/value";
import { getAssert } from "@/lib/utils";

export async function getTicketInfo({
  tick_id,
}: {
  tick_id: number;
}): Promise<Ticket[]> {
  //TODO should not be returning an array
  const data = await getAssert<Ticket[]>({
    route: `tickets/${tick_id}`,
    schemas: Ticket,
    isArray: true,
  });
  console.log("data: ", data);
  return data;
}

export async function updateTicket({
  tick_id,
  ticket_title,
  ticket_description,
  ticket_progress,
}: AtLeast<Ticket, "tick_id">) {
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
