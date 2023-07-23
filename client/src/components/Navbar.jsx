import React from "react";

const buttonStyle = "bg-dark text-light w-full";
import Link from "next/link";

const Navbar = () => {
	return (
		<nav className={"flex flex-col gap-3 h-full w-full p-3 bg-light"}>
			<Link href="/">
				<button className={buttonStyle}>DashBoard</button>
			</Link>
			<button className={buttonStyle}>My tickets</button>
			<button className={buttonStyle}>Inbox</button>
			<Link href="/manage-projects">
				<button className={buttonStyle}>Manage Projects</button>
			</Link>

			<button className={buttonStyle}>Profile</button>
			<button>logout</button>
		</nav>
	);
};

export default Navbar;
