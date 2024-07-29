"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjects } from "@/services/userService";
import { SessionStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Combobox } from "./combobox";
import { Project } from "@/lib/schemas";

interface UserProjectsProps {
  className?: string;
}

export default function UserProjects({ className }: UserProjectsProps) {
  const { currentProject, setProject, user_id: userid } = SessionStore();
  const {
    refetch: server_getProjects,
    isPending,
    isError,
    data: projects,
  } = useQuery<Project[]>({
    queryKey: ["getProjects"],
    queryFn: async () => {
      if (!!userid) {
        const projects = await getProjects({ userid: userid });
        if (projects.length > 0) {
          setProject(projects[0].proj_id);
        }
        return projects;
      } else {
        return [];
      }
    },
  });

  if (isError || !projects) {
    return <div>error...</div>;
  }

  return (
    <div className={className}>
      {isPending ? (
        <UserProjectsSkeleton />
      ) : (
        <Combobox
          projects={projects.map((proj) => {
            return { value: proj.proj_id, label: proj.proj_name };
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
