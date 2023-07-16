import React from "react";

const buttonStyle = "bg-dark text-light";

const Navbar = (className) => {
	return (
		<div className={"flex flex-col gap-3 h-full w-full p-3 bg-light"}>
			<button className={buttonStyle}>DashBoard</button>
			<button className={buttonStyle}>My tickets</button>
			<button className={buttonStyle}>Inbox</button>
			<button className={buttonStyle}>Manage Projects</button>
			<button className={buttonStyle}>Profile</button>
			<button>logout</button>
		</div>
	);
};

export default Navbar;
