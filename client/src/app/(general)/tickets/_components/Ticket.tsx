"use client";
//TODO skeleton loading
import { getTickets } from "@/services/userService";
import { SessionStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { ticketColumns } from "../../../../components/Columns";
import DataTable from "../../../../components/data-table";

export default function Ticket() {
  const { user_id } = SessionStore();
  const {
    refetch: server_getTickets,
    isPending,
    isError,
    data: userTickets,
  } = useQuery({
    queryKey: ["getTickets", user_id],
    queryFn: async () => {
      if (!!user_id) {
        return getTickets(user_id);
      } else {
        return [];
      }
    },
  });

  if (isPending) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>error...</div>;
  }

  return <DataTable columns={ticketColumns} data={userTickets} />;
}
