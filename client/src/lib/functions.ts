import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastError = (message: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const toastSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};
const base = process.env.NEXT_API_BASE || "http://localhost:5001";

//TODO change from get___ to getProject___
//TODO maybe use post instead of get with session ids and security features
//TODO move to actions folder

export const getTickets = async ({ projid }: { projid: number }) =>
  get({ route: `projects/${projid}/tickets` });

export const getProjects = async ({ userid }: { userid: number }) =>
  get({ route: `projects/${userid}` });

export const getHistory = async ({ projid }: { projid: number }) =>
  get({ route: `projects/${projid}/history` });

export const getTeam = async ({
  userid,
  projid,
}: {
  userid: number;
  projid: number;
}) => get({ route: `projects/${projid}/users/${userid}/team/` });

export const getAllTeams = async ({ projid }: { projid: number }) =>
  get({ route: `projects/${projid}/teams` });

export const getRoles = async ({ projid }: { projid: number }) =>
  get({ route: `projects/${projid}/roles` });

export const getUsers = async ({ projid }: { projid: number }) =>
  get({ route: `user/${projid}` });

//TODO fix caching
export const get = async <T>({ route }: { route: string }) => {
  try {
    const response = await fetch(`${base}/${route}`, {
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
