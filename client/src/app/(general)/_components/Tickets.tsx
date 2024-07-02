"use client";
//TODO skeleton loading
import { getProjectUserTickets as getTickets } from "@/actions/projectService";
import DataTable from "@/components/data-table";
import { ticketColumns } from "@/components/Columns";
import { useQuery } from "@tanstack/react-query";
import { ProjectStateStore } from "@/state";

interface TicketsProps {
  userid: number;
}

export default function Tickets({ userid }: TicketsProps) {
  const { currentProject: projid } = ProjectStateStore();

  const {
    refetch: server_getTickets,
    isPending,
    isError,
    data: tickets,
  } = useQuery({
    queryKey: ["getTickets", { projid, userid }],
    queryFn: async () => await getTickets({ projid: Number(projid), userid }),
  });

  if (isPending) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>error...</div>;
  }
  return <DataTable columns={ticketColumns} data={tickets} />;
}
