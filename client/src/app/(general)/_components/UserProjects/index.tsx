"use client";
import { getProjects } from "@/actions/userService";
import { useQuery } from "@tanstack/react-query";
import { Combobox } from "./combobox";
import { ProjectStateStore } from "@/state";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProjectsProps {
  userid: number;
  className?: string;
}

export default function UserProjects({ userid, className }: UserProjectsProps) {
  const {
    refetch: server_getProjects,
    isPending,
    isError,
    data: projects,
  } = useQuery({
    queryKey: ["getProjects"],
    queryFn: async () => await getProjects({ userid }),
  });

  const { currentProject, setProject } = ProjectStateStore();

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
