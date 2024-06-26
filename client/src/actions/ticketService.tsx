"use server";
// import typia from "typia";
import { base } from "@/actions/host";
import { assertIs } from "@/lib/utils";
import { Ticket } from "./types";
import assert from "assert";
import { Value } from "@sinclair/typebox/value";
import { TSchema } from "@sinclair/typebox";

export async function getTicket({
  tick_id,
}: {
  tick_id: number;
}): Promise<Ticket> {
  const data = await getAssert<Ticket>(`tickets/${tick_id}`, Ticket);
  return data;
}

async function getAssert<T>(route: string, schema: TSchema): Promise<T> {
  const data = await fetch(`${base}/${route}`, { cache: "no-store" }).then(
    (res) => {
      if (!res.ok) {
        throw new Error(res.status + " " + res.statusText);
      }
      return res.json();
    },
  );
  //FIXME
  assertIs<T>(schema, data);
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
