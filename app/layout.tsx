import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SqueroUniversity - UNICA',
  description: 'Aula virtual de la Universidad Nacional San Luis Gonzaga',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}