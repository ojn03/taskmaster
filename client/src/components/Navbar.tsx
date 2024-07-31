"use client";
import React from "react";
import { logout } from "@/services/authService";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const buttonStyle = "bg-dark text-light w-full";
  return (
    <nav className={"flex flex-col gap-3 h-full w-full p-3 bg-light"}>
      <Link href="/">
        <Button className={buttonStyle}>DashBoard</Button>
      </Link>
      <Link href="/tickets">
        <Button className={buttonStyle}>Tickets</Button>
      </Link>
      <Button className={buttonStyle}>Inbox</Button>
      <Link href="/projects">
        <Button className={buttonStyle}>Projects</Button>
      </Link>

      <Button className={buttonStyle}>Profile</Button>
      <Button onClick={() => logout()} className={buttonStyle}>
        Logout
      </Button>
    </nav>
  );
};

export default Navbar;
