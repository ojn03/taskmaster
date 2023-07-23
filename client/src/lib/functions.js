import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastError = ({ message }) => {
	toast.error(message, {
		position: "top-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored"
	});
};

export const toastSuccess = ({ message }) => {
	toast.success(message, {
		position: "top-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored"
	});
};

//todo change from get___ to getProject___
//todo maybe use post instead of get with session ids and security features


export const getTickets = async ({ projid }) => get ({ route: `tickets/${projid}`});

export const getProjects = async ({ userid }) => get ({ route: `projects/${userid}`});

export const getHistory = async ({ projid }) => get ({ route: `history/${projid}`});

export const getTeam = async ({ userid, projid }) => get ({ route: `team/${userid}/${projid}`});

export const getAllTeams = async ({ projid }) => get ({ route: `allteams/${projid}`}); 

export const getRoles = async ({ projid }) => get ({ route: `roles/${projid}`});

export const getUsers = async ({ projid }) => get ({ route: `user/${projid}`});

//todo fix caching
export const get = async ({ route }) => {
	try {
		const response = await fetch(`http://localhost:5001/${route}`, {
			cache: "no-store"
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return [];
	}
}