"use client";
import DataTable from "@/components/data-table";
import { getHistory } from "@/actions/projectService";
import { ProjectStateStore } from "@/state";
import { useQuery } from "@tanstack/react-query";
import { historyColumns } from "@/components/Columns";

interface props {
  userid: number;
}

export default function History({ userid }: props) {
  const { currentProject: projid } = ProjectStateStore();

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
