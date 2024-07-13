"use server";
import { post } from "@/lib/serverUtils";

interface Login {
  password: string;
}
interface LoginUsername extends Login {
  email?: never;
  username: string;
}

interface LoginEmail extends Login {
  username?: never;
  email: string;
}
export type LoginData = LoginUsername | LoginEmail;

type LoginResponse = {
  user_id: string;
};

async function login(data: LoginData) {
  const response = (await post({
    route: "auth/login",
    data,
  })) as LoginResponse;

  return response;
}

export { login };
