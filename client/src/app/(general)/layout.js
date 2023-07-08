import Navbar from "@/components/Navbar"
import "../globals.css"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {

}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full">
      <body className={`h-full flex w-full  bg-white relative
        ${inter.className}`}>
          <div className="absolute  left-0 top-0 h-[12%] w-full -z-10 bg-gradient-to-r from-blue-800 via-blue-500 to-blue-700"/>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
