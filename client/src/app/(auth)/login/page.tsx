"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toastError, toastSuccess } from "@/lib/functions";
import { ensureError } from "@/lib/utils";
//TODO implement without usestate
//TODO add icons to inputs
//TODO add forgot password
//TODO add remember me
//TODO sign in as demo user
//TODO make username and email radio buttons
//TODO use tailwindcomponents and fowbite

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
type LoginData = LoginUsername | LoginEmail;

const testdata: LoginData = {
  username: "",
  password: "",
  // email:""
};
const Login = () => {
  const { resetField, register, handleSubmit } = useForm<LoginData>();
  const [usernameLogin, setUsernameLogin] = useState(true);

  const onSubmit = async (data: LoginData) => {
    try {
      //response is an array

      //TODO move to functions.js
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json());
      if (!response.ok) {
        return toastError(response.status + " " + response.statusText);
      }
      toastSuccess("logged in");
    } catch (err) {
      const error = ensureError(err);
      console.error(error.message);
    }
  };

  // styles for username/email buttons
  const btnDark = "bg-dark text-white ";
  const btnLight =
    "text-dark bg-transparent hover:bg-slate-700 hover:text-white ";

  //styles for text inputs
  const inputStyle =
    "p-2 rounded-sm shadow-md border border-slate-300 focus:outline-none focus:ring-1  focus:ring-slate-600 focus:border-transparent";
  return (
    <div className="flex flex-col w-1/2 justify-center h-full items-center m-auto">
      {/* LOGIN FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md w-fit h-fit flex flex-col justify-center gap-3 p-5"
      >
        {/* USERNAME/EMAIL BUTTONS */}
        <div
          className=" flex w-full justify-center mx-auto rounded-md shadow-sm"
          role="group"
        >
          {/* USERNAME BUTTON */}
          <button
            type="button"
            className={`inline-flex items-center px-4 py-2 text-sm font-medium border border-r-0 border-dark rounded-l-lg ${usernameLogin ? btnDark : btnLight}`}
            onClick={() => {
              setUsernameLogin(true);
              resetField("email");
            }}
          >
            <svg
              className="w-fit h-3 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            Username
          </button>

          {/* EMAIL BUTTON */}
          <button
            type="button"
            className={`inline-flex items-center px-4 py-2 text-sm font-medium border border-dark rounded-r-lg ${!usernameLogin ? btnDark : btnLight}`}
            onClick={() => {
              setUsernameLogin(false);
              resetField("username");
            }}
          >
            <svg
              className="w-fit h-3 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
            </svg>
            Email
          </button>
        </div>

        {/* EMAIL INPUT */}
        {!usernameLogin && (
          <input
            required
            type="email"
            placeholder="email"
            className={inputStyle}
            {...register("email", { required: true })}
          />
        )}

        {/* USERNAME INPUT */}
        {usernameLogin && (
          <input
            required
            type="text"
            placeholder="username"
            className={inputStyle}
            {...register("username", { required: true })}
          />
        )}

        {/* PASSWORD INPUT */}
        <input
          required
          type="password"
          placeholder="password"
          className={inputStyle}
          {...register("password", { required: true })}
        />

        {/* SIGN IN BUTTON */}
        <button
          type="submit"
          className=" bg-dark py-2 px-4 w-fit  mx-auto rounded-[4px] text-white hover:bg-slate-700 transition-colors duration-300"
        >
          Sign In
        </button>
      </form>

      {/* SIGN UP LINK */}
      <div className="text-dark mt-2">
        <span className="text-base leading-4 font-semibold  ">
          Dont have an account?
        </span>
        <Link
          href="/login/register"
          className="block w-fit text-center mx-auto  underline"
        >
          sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
