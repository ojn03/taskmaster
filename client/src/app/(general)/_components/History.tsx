"use client";
import { historyColumns } from "@/components/Columns";
import DataTable from "@/components/data-table";
import { getHistory } from "@/services/projectService";
import { SessionStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

interface props {
  userid: number;
}

export default function History() {
  const { currentProject: projid } = SessionStore();

  const {
    refetch: server_getHistory,
    isPending,
    isError,
    data: historyData,
  } = useQuery({
    queryKey: ["getHistory", { projid }],
    queryFn: async () => {
      return !projid ? [] : await getHistory({ projid });
    },
  });

  if (isPending) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>error...</div>;
  }
  return <DataTable columns={historyColumns} data={historyData} />;
}
