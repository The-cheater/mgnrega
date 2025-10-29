import './globals.css'
import { Noto_Sans_Devanagari, Noto_Sans_Tamil, Noto_Sans_Bengali, Noto_Sans_Telugu, Noto_Sans_Kannada } from 'next/font/google'

const notoDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'], 
  weight: ['400','500','600','700'], 
  variable: '--font-devanagari',
  display: 'swap'
})

const notoTamil = Noto_Sans_Tamil({ 
  subsets: ['tamil'], 
  weight: ['400','500','600','700'], 
  variable: '--font-tamil',
  display: 'swap'
})

const notoBengali = Noto_Sans_Bengali({ 
  subsets: ['bengali'], 
  weight: ['400','500','600','700'], 
  variable: '--font-bengali',
  display: 'swap'
})

const notoTelugu = Noto_Sans_Telugu({ 
  subsets: ['telugu'], 
  weight: ['400','500','600','700'], 
  variable: '--font-telugu',
  display: 'swap'
})

const notoKannada = Noto_Sans_Kannada({ 
  subsets: ['kannada'], 
  weight: ['400','500','600','700'], 
  variable: '--font-kannada',
  display: 'swap'
})

export const metadata = { 
  title: 'MGNREGA Dashboard',
  description: 'Track and analyze MGNREGA performance across Indian districts'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${notoDevanagari.variable} ${notoTamil.variable} ${notoBengali.variable} ${notoTelugu.variable} ${notoKannada.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
