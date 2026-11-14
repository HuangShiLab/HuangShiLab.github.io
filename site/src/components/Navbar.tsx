import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Research', path: '/research' },
  { label: 'Team', path: '/team' },
  { label: 'Publications', path: '/publications' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Awards', path: '/awards' },
  { label: 'News', path: '/news' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={{
          backgroundColor: 'rgba(6, 11, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(56, 189, 166, 0.06)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <div className="mx-auto flex h-[72px] max-w-container items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span
              className="font-display text-[1.25rem] font-medium"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              HuangShiLab
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3 py-2 text-[0.875rem] font-medium uppercase tracking-[0.05em] transition-colors duration-300"
                style={{
                  color: isActive(link.path) ? 'var(--color-accent-teal)' : 'var(--color-text-secondary)',
                  borderBottom: isActive(link.path) ? '2px solid var(--color-accent-teal)' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) e.currentTarget.style.color = 'var(--color-text-accent)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Contact CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden lg:inline-flex items-center px-5 py-2 rounded-full text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300"
              style={{
                border: '1px solid rgba(45, 212, 168, 0.4)',
                color: 'var(--color-accent-teal)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-teal)'
                e.currentTarget.style.color = '#060B14'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--color-accent-teal)'
              }}
            >
              Contact
            </Link>

            {/* HKU logo */}
            <img
              src="/hku-logo.png"
              alt="HKU"
              className="hidden md:block h-8 w-8 object-contain opacity-80"
            />

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={24} style={{ color: 'var(--color-text-primary)' }} />
              ) : (
                <Menu size={24} style={{ color: 'var(--color-text-primary)' }} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6"
          style={{ backgroundColor: 'rgba(6, 11, 20, 0.97)', backdropFilter: 'blur(20px)' }}
        >
          <button
            className="absolute top-5 right-5 p-2"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} style={{ color: 'var(--color-text-primary)' }} />
          </button>
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-2xl font-display font-medium transition-colors duration-300"
              style={{
                color: isActive(link.path) ? 'var(--color-accent-teal)' : 'var(--color-text-primary)',
                animationDelay: `${i * 0.05}s`,
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="mt-4 px-8 py-3 rounded-full text-[0.875rem] font-semibold uppercase tracking-[0.05em]"
            style={{
              background: 'linear-gradient(135deg, #2DD4A8 0%, #22D3EE 100%)',
              color: '#060B14',
            }}
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </>
  )
}
