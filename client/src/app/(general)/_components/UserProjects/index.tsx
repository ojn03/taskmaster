"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjects } from "@/services/userService";
import { ProjectStore, SessionStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Combobox } from "./combobox";

interface UserProjectsProps {
  className?: string;
}

export default function UserProjects({ className }: UserProjectsProps) {
  const { user_id: userid } = SessionStore();
  const {
    refetch: server_getProjects,
    isPending,
    isError,
    data: projects,
  } = useQuery({
    queryKey: ["getProjects"],
    queryFn: async () =>
      !!userid ? await getProjects({ userid: userid }) : [],
  });

  const { currentProject, setProject } = ProjectStore();

  if (isError) {
    return <div>error...</div>;
  }

  return (
    <div className={className}>
      {isPending ? (
        <UserProjectsSkeleton />
      ) : (
        <Combobox
          projects={projects.map((proj) => {
            return { value: String(proj.proj_id), label: proj.proj_name };
          })}
          store={{ state: currentProject, setState: setProject }}
        />
      )}
    </div>
  );
}

function UserProjectsSkeleton() {
  return <Skeleton className="w-[200px] h-10 bg-gray-200" />;
}
