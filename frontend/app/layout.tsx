

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../components/ThemeProvider'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import Header from '@/components/Header/Header'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Survey App',
  description: 'Created by stephen Mutio software developer',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
       
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <Header/>
            {children}
            <ToastContainer />
          </ThemeProvider>
      </body>
    </html>
  )
}
