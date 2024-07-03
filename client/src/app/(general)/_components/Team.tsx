"use client";
//TODO skeleton loading
import { getTeamMembers } from "@/actions/projectService";
import DataTable from "@/components/data-table";
import { userRoleColumns } from "@/components/Columns";
import { useQuery } from "@tanstack/react-query";
import { ProjectStateStore } from "@/state";

interface Props {
  userid: number;
}

export default function Team({ userid }: Props) {
  const { currentProject: projid } = ProjectStateStore();

  const {
    refetch: server_getTeam,
    isPending,
    isError,
    data: teamMembers,
  } = useQuery({
    queryKey: ["getTeamMembers", { projid }],
    queryFn: async () =>
      await getTeamMembers({ projid: Number(projid), userid }),
  });

  if (isPending) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>error...</div>;
  }
  return <DataTable columns={userRoleColumns} data={teamMembers} />;
}
