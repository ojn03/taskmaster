import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get } from "./utils";

export const toastError = (message: string) => {
  toast.error(message, {
    position: "top-right",
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
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

//TODO change from get___ to getProject___
//TODO maybe use post instead of get with session ids and security features
//TODO move to actions folder

export const getTickets = ({ projid }: { projid: number }) =>
  get(`projects/${projid}/tickets`);

export const getHistory = ({ projid }: { projid: number }) =>
  get(`projects/${projid}/history`);

export const getTeam = ({
  userid,
  projid,
}: {
  userid: number;
  projid: number;
}) => get(`projects/${projid}/users/${userid}/team/`);

export const getAllTeams = ({ projid }: { projid: number }) =>
  get(`projects/${projid}/teams`);

export const getRoles = ({ projid }: { projid: number }) =>
  get(`projects/${projid}/roles`);

export const getUsers = ({ projid }: { projid: number }) =>
  get(`user/${projid}`);
