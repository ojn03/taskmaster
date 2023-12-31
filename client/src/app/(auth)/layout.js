import "../globals.css";

import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full">
      <body className={` h-full w-full ${inter.className}`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
