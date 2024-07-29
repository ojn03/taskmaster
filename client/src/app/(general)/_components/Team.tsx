"use client";
import { userRoleColumns } from "@/components/Columns";
import DataTable from "@/components/data-table";
import { getTeamMembers } from "@/services/projectService";
import { SessionStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {}

export default function Team({}: Props) {
  const { currentProject: projid } = SessionStore();
  const { user_id: userid } = SessionStore();
  const {
    refetch: server_getTeam,
    isPending,
    isError,
    data: teamMembers,
  } = useQuery({
    queryKey: ["getTeamMembers", { projid, userid }],
    queryFn: async () => {
      return !projid || !userid ? [] : await getTeamMembers({ projid, userid });
    },
  });

  if (isPending) {
    return <TeamSkeleton />;
  }
  if (isError) {
    return <div>error...</div>;
  }
  return <DataTable columns={userRoleColumns} data={teamMembers} />;
}

function TeamSkeleton() {
  return <Skeleton className="w-[200px] h-10 bg-gray-200" />;
}
