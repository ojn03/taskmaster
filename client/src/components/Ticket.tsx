"use client";

import {
  getProjectInfo,
  getProjectMembers,
  getProjectRoles,
  getProjectTickets,
} from "@/actions/projectService";
import { getTicketInfo } from "@/actions/ticketService";
import { useMutation } from "@tanstack/react-query";
import React from "react";

export default function Ticket() {
  const {
    mutate: server_getTicket,
    isPending,
    isError,
    data,
  } = useMutation({
    mutationFn: getProjectRoles,
  });

  if (isPending) {
    return <div>loading...</div>;
  }

  return (
    <div className="w-24 h-24 bg-pink-900 text-pretty">
      <button onClick={() => server_getTicket({ projid: 1 })}>get info</button>
      {data && (
        <div>
          {Object.entries(data[0]).map(([key, val]) => `${key}: ${val}`)}
        </div>
      )}
    </div>
  );
}
