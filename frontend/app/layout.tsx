import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import ClientLayout from './ClientLayout'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata = {
  title: 'Task Tracker',
  description: 'A sophisticated task management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
