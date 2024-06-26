"use client";

import { getTicket } from "@/actions/ticketService";
import { useMutation } from "@tanstack/react-query";
import React from "react";

export default function Ticket() {
  const {
    mutate: server_getTicket,
    isPending,
    isError,
    data,
  } = useMutation({
    mutationFn: getTicket,
  });

  if (isPending) {
    return <div>loading...</div>;
  }

  return (
    <div className="w-24 h-24 bg-pink-900 text-pretty">
      <button onClick={() => server_getTicket({ tick_id: 1 })}>
        get ticket
      </button>
      {data && <div>{data.ticket_title}</div>}
    </div>
  );
}
