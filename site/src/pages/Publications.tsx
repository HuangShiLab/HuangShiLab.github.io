import type { ReactElement } from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, BookOpen } from 'lucide-react'
import { publications as pubsData } from '@/data'
import statsJson from '@/data/stats.json'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

type Category = 'All' | 'Metagenomics Methods' | 'Microbiome & Disease' | 'Probiotics'

interface Publication {
  id: number
  title: string
  authors: string
  journal: string
  year: number
  category: Category
  doi: string
}

const categories: Category[] = ['All', 'Metagenomics Methods', 'Microbiome & Disease', 'Probiotics']

const categoryBadgeStyle: Record<Exclude<Category, 'All'>, { bg: string; color: string; border: string }> = {
  'Metagenomics Methods': {
    bg: 'rgba(34,211,238,0.12)',
    color: '#22D3EE',
    border: 'rgba(34,211,238,0.25)',
  },
  'Microbiome & Disease': {
    bg: 'rgba(45,212,168,0.12)',
    color: '#2DD4A8',
    border: 'rgba(45,212,168,0.25)',
  },
  'Probiotics': {
    bg: 'rgba(74,222,128,0.12)',
    color: '#4ADE80',
    border: 'rgba(74,222,128,0.25)',
  },
}

const publications = pubsData as Publication[]

const journalHighlights = [
  { name: 'Nature Methods', focus: 'Method development' },
  { name: 'Cell Host & Microbe', focus: 'Disease prediction' },
  { name: 'Microbiome', focus: 'Probiotic evolution' },
  { name: 'Genome Biology', focus: '2bRAD-M method' },
  { name: 'ISME Journal', focus: 'Microbiome ecology' },
  { name: 'Cell Host & Microbe', focus: 'Constipation genetics' },
  { name: 'Gut Microbes', focus: 'Probiotic adaptation' },
  { name: 'mSystems', focus: 'Skin/gut microbiome' },
  { name: 'Engineering', focus: 'Microbiome & IBD' },
]

/* ------------------------------------------------------------------ */
/*  HELPER: Highlight author names                                     */
/* ------------------------------------------------------------------ */
function highlightAuthors(authors: string): ReactElement {
  const parts = authors.split(/(Huang S|Huang Shi|Shi Huang)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part === 'Huang S' || part === 'Huang Shi' || part === 'Shi Huang') {
          return (
            <span key={i} style={{ color: 'var(--color-accent-teal)', fontWeight: 500 }}>
              {part}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  MINI PARTICLE CANVAS                                               */
/* ------------------------------------------------------------------ */
function MiniParticles() {
  const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w: number, h: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = []

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      canvas!.width = w
      canvas!.height = h
    }

    function init() {
      particles.length = 0
      const count = 20
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 1,
          a: Math.random() * 0.5 + 0.15,
        })
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h)
      for (const p of particles) {
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(45,212,168,${p.a})`
        ctx!.fill()

        for (const q of particles) {
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx!.beginPath()
            ctx!.moveTo(p.x, p.y)
            ctx!.lineTo(q.x, q.y)
            ctx!.strokeStyle = `rgba(45,212,168,${0.08 * (1 - dist / 100)})`
            ctx!.stroke()
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    init()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15, pointerEvents: 'none' }} />
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

export default function Publications() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  const filtered = useMemo(() => {
    let list = [...publications]

    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.authors.toLowerCase().includes(q) ||
          p.journal.toLowerCase().includes(q),
      )
    }

    list.sort((a, b) => (sortBy === 'newest' ? b.year - a.year : a.year - b.year))
    return list
  }, [activeCategory, searchQuery, sortBy])

  /* Reset scroll on mount */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* ============ HERO ============ */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '50vh' }}
      >
        <MiniParticles />
        <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center py-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-4"
            style={{ color: 'var(--color-accent-teal)' }}
          >
            // Publications
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-display font-normal"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--color-text-primary)' }}
          >
            Publications
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mx-auto mt-6 text-[1.125rem] leading-[1.7]"
            style={{ color: 'var(--color-text-secondary)', maxWidth: '700px' }}
          >
            Over 40 research papers in peer-reviewed journals, including 20 first- or corresponding-authored papers in Nature Methods, Cell Host Microbe, Microbiome, Genome Biology, ISMEJ, and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-8 lg:gap-12"
          >
            {[
              { num: '40+', label: 'Total Papers' },
              { num: '20', label: 'First/Corresponding' },
              { num: String(statsJson.h_index_all), label: 'H-Index' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-mono text-[2rem] font-medium gradient-text-teal"
                >
                  {stat.num}
                </div>
                <div className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FILTER BAR & LIST ============ */}
      <section style={{ backgroundColor: 'var(--color-bg-secondary)' }} className="section-padding">
        {/* Sticky Filter Bar */}
        <div
          className="sticky top-[72px] z-40"
          style={{
            backgroundColor: 'rgba(10, 21, 37, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(56,189,168,0.08)',
          }}
        >
          <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-3 py-1.5 rounded-full text-[0.8rem] font-medium transition-all duration-200"
                    style={{
                      color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      backgroundColor: active ? 'rgba(45,212,168,0.15)' : 'transparent',
                      border: active ? '1px solid rgba(45,212,168,0.3)' : '1px solid rgba(56,189,168,0.12)',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.backgroundColor = 'rgba(45,212,168,0.08)'
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{
                  background: 'rgba(10, 21, 37, 0.72)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(56,189,168,0.12)',
                }}
              >
                <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search publications..."
                  className="bg-transparent outline-none text-[0.875rem]"
                  style={{ color: 'var(--color-text-primary)', width: '180px', fontFamily: 'Inter, system-ui, sans-serif' }}
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="rounded-lg px-3 py-1.5 text-[0.875rem] outline-none cursor-pointer"
                style={{
                  background: 'rgba(10, 21, 37, 0.72)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(56,189,168,0.12)',
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                <option value="newest">Sort by Year ↓</option>
                <option value="oldest">Sort by Year ↑</option>
              </select>
            </div>
          </div>
        </div>

        {/* Publication List */}
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery + sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              {filtered.length === 0 && (
                <div className="text-center py-16" style={{ color: 'var(--color-text-muted)' }}>
                  <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
                  <p>No publications found matching your criteria.</p>
                </div>
              )}

              {filtered.map((pub, i) => {
                const badgeStyle = categoryBadgeStyle[pub.category as Exclude<Category, 'All'>]
                return (
                  <motion.a
                    key={pub.id}
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="group block rounded-2xl transition-all duration-300"
                    style={{
                      background: 'rgba(10, 21, 37, 0.72)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(56,189,168,0.12)',
                      padding: '1.25rem 1.5rem',
                      borderLeft: '3px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderLeftColor = 'var(--color-accent-teal)'
                      e.currentTarget.style.backgroundColor = 'rgba(45,212,168,0.03)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderLeftColor = 'transparent'
                      e.currentTarget.style.backgroundColor = 'rgba(10, 21, 37, 0.72)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    {/* Top row */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <h3 className="text-[0.95rem] font-medium leading-[1.5] flex-1" style={{ color: 'var(--color-text-primary)' }}>
                        {pub.title}
                      </h3>
                      <span
                        className="shrink-0 rounded-full px-3 py-0.5 text-[0.75rem] font-medium"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-accent-cyan)' }}
                      >
                        {pub.year}
                      </span>
                    </div>

                    {/* Authors */}
                    <p className="mt-2 text-[0.8rem] leading-[1.5]" style={{ color: 'var(--color-text-muted)' }}>
                      {highlightAuthors(pub.authors)}
                    </p>

                    {/* Bottom row */}
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="font-display italic text-[0.9rem]" style={{ color: 'var(--color-text-secondary)' }}>
                        {pub.journal}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[0.7rem] font-medium"
                        style={{
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.color,
                          border: `1px solid ${badgeStyle.border}`,
                        }}
                      >
                        {pub.category}
                      </span>
                    </div>
                  </motion.a>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {/* Publication count */}
          <p className="mt-6 text-center text-[0.75rem]" style={{ color: 'var(--color-text-muted)' }}>
            Showing {filtered.length} of {publications.length} publications
          </p>
        </div>
      </section>

      {/* ============ JOURNAL HIGHLIGHTS ============ */}
      <section style={{ backgroundColor: 'var(--color-bg-primary)' }} className="section-padding">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-3"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              // Journal Impact
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium"
              style={{ letterSpacing: '-0.01em', lineHeight: 1.2, color: 'var(--color-text-primary)' }}
            >
              Published In
            </motion.h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {journalHighlights.map((j, i) => (
              <motion.div
                key={j.name + i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scaleIn}
                className="rounded-2xl transition-all duration-300"
                style={{
                  background: 'rgba(10, 21, 37, 0.72)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(56,189,168,0.12)',
                  padding: '1.25rem 1.5rem',
                  minWidth: '180px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(56,189,168,0.3)'
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(45, 212, 168, 0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(56,189,168,0.12)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <h3 className="font-display text-[1.25rem] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {j.name}
                </h3>
                <p className="mt-1 text-[0.75rem]" style={{ color: 'var(--color-text-muted)' }}>
                  {j.focus}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section style={{ backgroundColor: 'var(--color-bg-secondary)' }} className="section-padding">
        <div className="mx-auto max-w-[640px] px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium"
            style={{ letterSpacing: '-0.01em', lineHeight: 1.2, color: 'var(--color-text-primary)' }}
          >
            Want to Dive Deeper?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mt-4 text-[1rem] leading-[1.7]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Explore our research areas in detail or learn more about our team.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/research"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #2DD4A8 0%, #22D3EE 100%)',
                color: '#060B14',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(45, 212, 168, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Our Research <ArrowRight size={16} />
            </Link>
            <Link
              to="/team"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300"
              style={{
                border: '1px solid rgba(45, 212, 168, 0.4)',
                color: 'var(--color-accent-teal)',
                backgroundColor: 'transparent',
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
              Meet the Team
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
