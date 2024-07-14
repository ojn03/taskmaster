"use client";
//TODO skeleton loading
import { ticketColumns } from "@/components/Columns";
import DataTable from "@/components/data-table";
import { getProjectUserTickets as getTickets } from "@/services/projectService";
import { ProjectStore, SessionStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

interface TicketsProps {}

export default function Tickets({}: TicketsProps) {
  const { currentProject: projid } = ProjectStore();
  const { user_id: userid } = SessionStore();

  const {
    refetch: server_getTickets,
    isPending,
    isError,
    data: tickets,
  } = useQuery({
    queryKey: ["getTickets", { projid, userid }],
    queryFn: async () =>
      await getTickets({ projid: Number(projid), userid: Number(userid) }),
  });

  if (isPending) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>error...</div>;
  }
  return <DataTable columns={ticketColumns} data={tickets} />;
}
