import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
