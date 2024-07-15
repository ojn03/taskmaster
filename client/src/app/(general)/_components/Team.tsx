"use client";
//TODO skeleton loading
import { userRoleColumns } from "@/components/Columns";
import DataTable from "@/components/data-table";
import { getTeamMembers } from "@/services/projectService";
import { ProjectStore, SessionStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

interface Props {}

export default function Team({}: Props) {
  const { currentProject: projid } = ProjectStore();
  const { user_id: userid } = SessionStore();
  const {
    refetch: server_getTeam,
    isPending,
    isError,
    data: teamMembers,
  } = useQuery({
    queryKey: ["getTeamMembers", { projid }],
    queryFn: async () => {
      return !projid || !userid ? [] : await getTeamMembers({ projid, userid });
    },
  });

  if (isPending) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>error...</div>;
  }
  return <DataTable columns={userRoleColumns} data={teamMembers} />;
}
