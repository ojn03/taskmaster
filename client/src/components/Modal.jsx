import React from "react";

const Modal = ({ children }) => {
	return (
		<div className="bg-black/50 w-screen absolute h-screen  top-0 left-0 z-[999] flex">
			<div
				className="bg-light m-auto w-fit h-fit 
          border-black rounded-md min-h-[100px] min-w-[100px]"
			>
				{children}
			</div>
		</div>
	);
};

export default Modal;
