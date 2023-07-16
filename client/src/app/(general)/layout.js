import Navbar from "@/components/Navbar";
import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="h-full w-full">
			<body
				className={`h-full flex w-full relative
        ${inter.className}`}
			>
				{/* top decorative banner emerald or amber */}
				<div className="absolute  right-0 top-0 h-[12%] w-[90%] -z-10 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500" />

				{/* navbar on left */}
				<div className="w-[10%] h-full">
					<Navbar />
				</div>

				{/* main content */}
				<div className="w-[90%] h-full">{children}</div>
			</body>
		</html>
	);
}
