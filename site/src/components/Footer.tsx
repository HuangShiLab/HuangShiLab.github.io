import { Link } from 'react-router'

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Research', path: '/research' },
  { label: 'Team', path: '/team' },
  { label: 'Publications', path: '/publications' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Awards', path: '/awards' },
  { label: 'Contact', path: '/contact' },
]

const resourceLinks = [
  { label: 'GitHub Repository', path: 'https://github.com/HuangShiLab', external: true },
]

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-bg-tertiary)',
        borderTop: '1px solid rgba(56, 189, 166, 0.06)',
      }}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Lab Info */}
          <div>
            <h3
              className="font-display text-[1.5rem] font-semibold mb-3"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              HuangShiLab
            </h3>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Microbiome Research Lab
            </p>
            <p className="text-[0.875rem]" style={{ color: 'var(--color-text-secondary)' }}>
              Faculty of Dentistry
              <br />
              The University of Hong Kong
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[0.875rem] transition-colors duration-200"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent-teal)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Resources
            </h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.875rem] transition-colors duration-200"
                      style={{ color: 'var(--color-text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent-teal)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-[0.875rem] transition-colors duration-200"
                      style={{ color: 'var(--color-text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent-teal)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Mini */}
          <div>
            <h4 className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Contact
            </h4>
            <div className="space-y-2 text-[0.875rem]" style={{ color: 'var(--color-text-secondary)' }}>
              <p>Room 2A10, Prince Philip Dental Hospital, HKU</p>
              <p>
                <a
                  href="mailto:shihuang@hku.hk"
                  className="transition-colors duration-200"
                  style={{ color: 'var(--color-accent-teal)' }}
                >
                  shihuang@hku.hk
                </a>
              </p>
              <p style={{ color: 'var(--color-text-muted)' }}>WhatsApp Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="w-full py-6 text-center"
        style={{ borderTop: '1px solid rgba(56, 189, 166, 0.06)' }}
      >
        <p className="text-[0.75rem]" style={{ color: 'var(--color-text-muted)' }}>
          &copy; 2025 HuangShiLab. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
