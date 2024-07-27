import { getAssert, patch } from "@/lib/utils";
import { AtLeast, Ticket } from "../lib/schemas";

export async function getTicketInfo({
  tick_id,
}: {
  tick_id: string;
}): Promise<Ticket[]> {
  //TODO should not be returning an array
  const data = await getAssert<Ticket[]>({
    route: `tickets/${tick_id}`,
    schemas: Ticket,
    isArray: true,
  });
  return data;
}

export async function updateTicket({
  tick_id,
  ticket_title,
  ticket_description,
  ticket_progress,
}: AtLeast<Ticket, "tick_id">) {
  return await patch({
    route: `tickets/${tick_id}`,
    body: {
      ticket_title,
      ticket_description,
      ticket_progress,
    },
  });
}
