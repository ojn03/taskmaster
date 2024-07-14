"use client";
import { historyColumns } from "@/components/Columns";
import DataTable from "@/components/data-table";
import { getHistory } from "@/services/projectService";
import { ProjectStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

interface props {
  userid: number;
}

export default function History() {
  const { currentProject: projid } = ProjectStore();

  const {
    refetch: server_getHistory,
    isPending,
    isError,
    data: historyData,
  } = useQuery({
    queryKey: ["getHistory", { projid }],
    queryFn: async () => await getHistory({ projid: Number(projid) }),
  });

  if (isPending) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>error...</div>;
  }
  return <DataTable columns={historyColumns} data={historyData} />;
}
