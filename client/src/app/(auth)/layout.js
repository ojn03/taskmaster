import '../globals.css'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='h-full w-full'>
      <body className={`bg-gradient-radial from-indigo-500 via-indigo-600 to-indigo-800 h-full w-full ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
