"use client";
//TODO skeleton loading
import { ticketColumns } from "@/components/Columns";
import DataTable from "@/components/data-table";
import { getProjectUserTickets as getTickets } from "@/services/projectService";
import { SessionStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface TicketsProps {}

export default function Tickets() {
  const { currentProject: projid, user_id: userid } = SessionStore();

  const {
    refetch: server_getTickets,
    isPending,
    isError,
    data: tickets,
  } = useQuery({
    queryKey: ["getTickets", { projid, userid }],
    queryFn: async () => {
      return !!projid && !!userid
        ? await getTickets({ projid: projid, userid: userid })
        : [];
    },
  });

  if (isPending) {
    return <TicketsSkeleton />;
  }
  if (isError) {
    return <div>error...</div>;
  }
  return <DataTable columns={ticketColumns} data={tickets} />;
}

function TicketsSkeleton() {
  return <Skeleton className="w-[200px] h-10 bg-gray-200" />;
}
