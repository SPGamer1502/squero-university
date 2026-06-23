import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SqueroUniversity - SQueroU',
  description: 'Aula virtual de la Universidad Nacional SqueroUniversity',
  icons: {
    icon: '/Favicon.png',  // Asegúrate de que coincida exactamente con el nombre en 'public'
  },
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