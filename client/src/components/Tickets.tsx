"use client";
//TODO skeleton loading
import { getProjectUserTickets as getTickets } from "@/actions/projectService";
import DataTable from "./data-table";
import * as Columns from "@/components/Columns";
import { useQuery } from "@tanstack/react-query";

interface TicketsProps {
  projid: number;
  userid: number;
}

export default function Tickets({ projid, userid }: TicketsProps) {
  const {
    refetch: server_getTickets,
    isPending,
    isError,
    data: tickets,
  } = useQuery({
    queryKey: ["getTickets", { projid, userid }],
    queryFn: async () => await getTickets({ projid, userid }),
  });

  if (isPending) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>error...</div>;
  }
  return <DataTable columns={Columns.ticketColumns} data={tickets} />;
}
