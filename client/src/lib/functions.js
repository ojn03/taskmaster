import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toastError = ({ message }) => {
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
}

export const toastSuccess = ({ message }) => {
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
}

//todo fix caching
export const getTickets = async ({ projid }) => {
    try {
        const response = await fetch(`http://localhost:5001/tickets/${projid}`, { cache: 'no-store' })
        const data = await response.json()
        return data;

    } catch (error) {
        console.error(error);
        return [];
    }
}


export const getProjects = async ({ userid }) => {
    try {
        const response = await fetch(`http://localhost:5001/projects/${userid}`, { cache: 'no-store' })
        const data = await response.json()
        return data;

    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getHistory = async ({ projid }) => {
    try {
        const response = await fetch(`http://localhost:5001/history/${projid}`, { cache: 'no-store' })
        const data = await response.json()
        return data;

    } catch (error) {
        console.error(error);
        return [];
    }
}
