'use server'
import { revalidatePath } from "next/cache";

type User = {
    user_id: number;
    first: string;
    last: string;
    email: string;
}

export const getUser = async (user_id: number): Promise<User> => {
    const res = await fetch(`/api/users/${user_id}`);
    return await res.json();
}
