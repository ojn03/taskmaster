import { post } from "@/lib/utils";
import { SessionStore } from "@/store";

//TODO parse uuids
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

async function logout() {
  const { user_id, eraseSessionStore } = SessionStore.getState();
  eraseSessionStore();
  console.log("user_id", user_id);

  await post({
    route: "auth/logout",
    data: { user_id },
  });

  //TODO get this to work. needs to be in a server action
  // revalidatePath("/");
}

export { login, logout };
