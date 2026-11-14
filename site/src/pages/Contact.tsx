import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  Mail,
  MapPin,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  FlaskConical,
  Users,
  BookOpen,
  Calendar,
  ChevronRight,
  TrainFront,
  Bus,
  ArrowRight,
} from 'lucide-react'

/* ────────────────────────────── easing */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ────────────────────────────── animation variants */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const scaleIn = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

/* ═══════════════════════════════════════════════════════════
   Section 1 — Page Hero
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: '50vh',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      {/* subtle teal glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(45,212,168,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-4"
          style={{ color: 'var(--color-accent-teal)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.1 }}
        >
          // Contact
        </motion.p>

        <motion.h1
          className="font-display gradient-text-teal mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.2 }}
        >
          Get in Touch
        </motion.h1>

        <motion.p
          className="mx-auto max-w-[600px]"
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.35 }}
        >
          We welcome collaboration inquiries, student applications, and research
          discussions. Reach out to us through any of the channels below.
        </motion.p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Section 2 — Contact Cards
   ═══════════════════════════════════════════════════════════ */

/* Copy-to-clipboard button */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback — do nothing
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center p-1.5 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100"
      style={{
        color: copied
          ? 'var(--color-accent-green)'
          : 'var(--color-text-muted)',
        backgroundColor: 'rgba(56, 189, 166, 0.08)',
      }}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}

/* Glassmorphism card base */
function ContactCard({
  icon,
  title,
  children,
  index,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  index: number
}) {
  return (
    <motion.div
      className="group flex flex-col gap-4"
      style={{
        padding: '2rem',
        minHeight: 280,
        background: 'rgba(10, 21, 37, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(56, 189, 166, 0.12)',
        borderRadius: 16,
        transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(56, 189, 166, 0.30)'
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 40px rgba(45, 212, 168, 0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(56, 189, 166, 0.12)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.6,
        ease: easeOutExpo,
        delay: index * 0.12,
      }}
    >
      {/* Icon circle */}
      <div
        className="flex items-center justify-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          border: '1px solid rgba(45, 212, 168, 0.2)',
        }}
      >
        {icon}
      </div>

      <h3
        className="font-body text-[1.25rem] font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h3>

      <div className="flex-1">{children}</div>
    </motion.div>
  )
}

function ContactCardsSection() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Email */}
          <ContactCard
            icon={<Mail size={32} style={{ color: 'var(--color-accent-teal)' }} />}
            title="Email"
            index={0}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-body text-[0.95rem]"
                style={{ color: 'var(--color-text-primary)' }}
              >
                shihuang@hku.hk
              </span>
              <CopyButton text="shihuang@hku.hk" />
            </div>
            <a
              href="mailto:shihuang@hku.hk"
              className="inline-flex items-center gap-1 mt-3 font-body text-[0.875rem] font-medium transition-colors duration-200"
              style={{ color: 'var(--color-accent-teal)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-cyan)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-teal)'
              }}
            >
              Send Email
              <ArrowRight size={14} />
            </a>
          </ContactCard>

          {/* Card 2: Address */}
          <ContactCard
            icon={<MapPin size={32} style={{ color: 'var(--color-accent-teal)' }} />}
            title="Address"
            index={1}
          >
            <div
              className="font-body text-[0.875rem]"
              style={{
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
              }}
            >
              Faculty of Dentistry
              <br />
              The University of Hong Kong
              <br />
              Room 2A10, Prince Philip Dental Hospital
              <br />
              34 Hospital Road, Sai Ying Pun
              <br />
              Hong Kong
            </div>
            <a
              href="https://maps.google.com/?q=Prince+Philip+Dental+Hospital+34+Hospital+Road+Sai+Ying+Pun+Hong+Kong"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 font-body text-[0.875rem] font-medium transition-colors duration-200"
              style={{ color: 'var(--color-accent-teal)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-cyan)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-teal)'
              }}
            >
              View on Google Maps
              <ExternalLink size={14} />
            </a>
          </ContactCard>

          {/* Card 3: WhatsApp */}
          <ContactCard
            icon={<MessageCircle size={32} style={{ color: 'var(--color-accent-teal)' }} />}
            title="WhatsApp"
            index={2}
          >
            <div className="flex flex-col items-center">
              <div
                className="p-3 mb-2"
                style={{
                  background: 'rgba(10, 21, 37, 0.5)',
                  borderRadius: 12,
                  border: '1px solid rgba(56, 189, 166, 0.08)',
                }}
              >
                <img
                  src="https://github.com/user-attachments/assets/0f3b4b96-d756-4e2a-b8e3-a281ffef201e"
                  alt="WhatsApp QR Code"
                  style={{ width: 180, height: 180, objectFit: 'contain' }}
                  loading="lazy"
                />
              </div>
              <p
                className="font-body text-[0.75rem]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Scan to connect on WhatsApp
              </p>
            </div>
          </ContactCard>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Section 3 — Map
   ═══════════════════════════════════════════════════════════ */
function MapSection() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <motion.p
            className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-4"
            style={{ color: 'var(--color-accent-teal)' }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            // Location
          </motion.p>
          <motion.h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--color-text-primary)',
            }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.1 }}
          >
            Find Us
          </motion.h2>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left — Map Embed */}
          <motion.div
            className="lg:w-[65%] overflow-hidden"
            style={{
              borderRadius: 16,
              border: '1px solid rgba(56, 189, 166, 0.1)',
              background: 'rgba(10, 21, 37, 0.72)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.15 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.83635!2d114.1420!3d22.2866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3403ff8f1f95e+9df%3A0x7e1+0x6a+0x5a+0x5a+0x1+0x0!2sPrince+Philip+Dental+Hospital!5e0!3m2!1sen!2shk!4v1700000000000!5m2!1sen!2shk"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: 16, filter: 'grayscale(40%) contrast(1.1)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Prince Philip Dental Hospital Location"
            />
          </motion.div>

          {/* Right — Location Info */}
          <motion.div
            className="lg:w-[35%] flex flex-col gap-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.25 }}
          >
            <div>
              <h3
                className="font-body text-[1.125rem] font-semibold mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Prince Philip Dental Hospital
              </h3>
              <p
                className="font-body text-[1rem] mb-4"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Room 2A10
              </p>
              <p
                className="font-body text-[0.875rem]"
                style={{
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                Faculty of Dentistry
                <br />
                The University of Hong Kong
                <br />
                Room 2A10, Prince Philip Dental Hospital
                <br />
                34 Hospital Road, Sai Ying Pun
                <br />
                Hong Kong
              </p>
            </div>

            {/* Getting there */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-start gap-3">
                <TrainFront
                  size={18}
                  className="mt-0.5 shrink-0"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <p
                  className="font-body text-[0.8rem]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Nearest station: Sai Ying Pun (West Island Line), Exit B2
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Bus
                  size={18}
                  className="mt-0.5 shrink-0"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <p
                  className="font-body text-[0.8rem]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Multiple bus routes along Queen's Road West
                </p>
              </div>
            </div>

            {/* HKU link */}
            <a
              href="https://facdent.hku.hk/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-body text-[0.875rem] font-medium transition-colors duration-200"
              style={{ color: 'var(--color-accent-teal)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-cyan)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-teal)'
              }}
            >
              HKU Faculty of Dentistry
              <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Section 4 — Quick Links
   ═══════════════════════════════════════════════════════════ */

interface QuickLinkData {
  label: string
  icon: React.ReactNode
  path: string
}

const quickLinks: QuickLinkData[] = [
  {
    label: 'Our Research',
    icon: <FlaskConical size={20} style={{ color: 'var(--color-accent-teal)' }} />,
    path: '/research',
  },
  {
    label: 'Meet the Team',
    icon: <Users size={20} style={{ color: 'var(--color-accent-teal)' }} />,
    path: '/team',
  },
  {
    label: 'Publications',
    icon: <BookOpen size={20} style={{ color: 'var(--color-accent-teal)' }} />,
    path: '/publications',
  },
  {
    label: 'Group Meeting',
    icon: <Calendar size={20} style={{ color: 'var(--color-accent-teal)' }} />,
    path: '/group-meeting',
  },
]

function QuickLinkCard({
  link,
  index,
}: {
  link: QuickLinkData
  index: number
}) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.6,
        ease: easeOutExpo,
        delay: index * 0.08,
      }}
    >
      <Link
        to={link.path}
        className="group/link flex items-center gap-3"
        style={{
          padding: '1.25rem',
          background: 'rgba(10, 21, 37, 0.72)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 166, 0.12)',
          borderRadius: 16,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(56, 189, 166, 0.30)'
          e.currentTarget.style.boxShadow = '0 8px 40px rgba(45, 212, 168, 0.06)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(56, 189, 166, 0.12)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {link.icon}
        <span
          className="font-body text-[0.95rem] font-medium flex-1 transition-colors duration-200"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {link.label}
        </span>
        <ChevronRight
          size={16}
          className="transition-transform duration-200 group-hover/link:translate-x-1"
          style={{ color: 'var(--color-text-muted)' }}
        />
      </Link>
    </motion.div>
  )
}

function QuickLinksSection() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="font-display mb-10"
          style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            color: 'var(--color-text-primary)',
          }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          Explore More
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {quickLinks.map((link, index) => (
            <QuickLinkCard
              key={link.path}
              link={link}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════════════ */
export default function Contact() {
  return (
    <main>
      <HeroSection />
      <ContactCardsSection />
      <MapSection />
      <QuickLinksSection />
    </main>
  )
}
