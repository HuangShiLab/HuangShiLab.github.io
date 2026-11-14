import { useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy, Calendar, MapPin } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

interface Award {
  id: number
  title: string
  event: string
  location: string
  presenter: string
  year: number
  badge: string
  badgeColor: string
}

interface ConferenceTalk {
  id: number
  date: string
  title: string
  location: string
}

interface Institution {
  id: number
  name: string
  year: string
}

const awards: Award[] = [
  {
    id: 1,
    title: 'Joseph Lister Award Finalist',
    event: 'IADR 2025',
    location: 'Barcelona, Spain',
    presenter: 'Dr. Shi Huang',
    year: 2025,
    badge: 'Finalist',
    badgeColor: 'rgba(251,191,36,0.15)',
  },
  {
    id: 2,
    title: 'Outstanding Poster Award',
    event: 'Chinese Association of Microbial Ecology',
    location: 'Qingdao, China (Nov 2024)',
    presenter: 'Yufeng Zhang',
    year: 2024,
    badge: 'Best Poster',
    badgeColor: 'rgba(45,212,168,0.15)',
  },
  {
    id: 3,
    title: 'Best Poster Award',
    event: '2nd Frontiers Forum on Next-Generation Biomaterials in Dental Medicine',
    location: 'Hong Kong (Jun 2024)',
    presenter: 'Yufeng Zhang',
    year: 2024,
    badge: 'Best Poster',
    badgeColor: 'rgba(45,212,168,0.15)',
  },
  {
    id: 4,
    title: 'HKU TEC MedTech Hackathon Finalist',
    event: 'HKU TEC MedTech Hackathon 2024',
    location: 'Hong Kong',
    presenter: 'Team ProbioMine Biotech',
    year: 2024,
    badge: 'Finalist',
    badgeColor: 'rgba(251,191,36,0.15)',
  },
  {
    id: 5,
    title: 'Best Poster Award',
    event: 'SMART Symposium',
    location: 'Shenzhen, China (Jan 2024)',
    presenter: 'Dr. Shi Huang',
    year: 2024,
    badge: 'Best Poster',
    badgeColor: 'rgba(45,212,168,0.15)',
  },
  {
    id: 6,
    title: 'Poster of Distinction Award',
    event: 'IDDF 2023',
    location: 'Hong Kong',
    presenter: 'Dr. Shi Huang',
    year: 2023,
    badge: 'Distinction',
    badgeColor: 'rgba(34,211,238,0.15)',
  },
  {
    id: 7,
    title: 'Best Poster Award',
    event: 'TU-HKU-FJMU International Symposium',
    location: 'Hong Kong (Nov 2022)',
    presenter: 'Dr. Shi Huang',
    year: 2022,
    badge: 'Best Poster',
    badgeColor: 'rgba(45,212,168,0.15)',
  },
  {
    id: 8,
    title: 'Shandong Science and Technology Progress Third-class Award',
    event: 'Shandong Provincial Government',
    location: 'China',
    presenter: 'Dr. Shi Huang (Co-I)',
    year: 2022,
    badge: 'Award',
    badgeColor: 'rgba(45,212,168,0.15)',
  },
  {
    id: 9,
    title: 'Qingdao Science and Technology Progress Second-class Award',
    event: 'Qingdao Municipal Government',
    location: 'China',
    presenter: 'Dr. Shi Huang (Co-I)',
    year: 2021,
    badge: 'Award',
    badgeColor: 'rgba(45,212,168,0.15)',
  },
  {
    id: 10,
    title: 'International Postdoctoral Exchange Fellowship Program',
    event: 'China Postdoctoral Science Foundation',
    location: 'China',
    presenter: 'Dr. Shi Huang',
    year: 2017,
    badge: 'Fellowship',
    badgeColor: 'rgba(251,191,36,0.15)',
  },
  {
    id: 11,
    title: 'China Postdoctoral Science Foundation-CAS Joint Fellowship',
    event: 'China Postdoctoral Science Foundation',
    location: 'China',
    presenter: 'Dr. Shi Huang',
    year: 2016,
    badge: 'Fellowship',
    badgeColor: 'rgba(251,191,36,0.15)',
  },
]

/* Group awards by year */
const awardsByYear = awards.reduce<Record<number, Award[]>>((acc, award) => {
  if (!acc[award.year]) acc[award.year] = []
  acc[award.year].push(award)
  return acc
}, {})

const yearKeys = Object.keys(awardsByYear).map(Number).sort((a, b) => b - a)

const conferenceTalks: ConferenceTalk[] = [
  {
    id: 1,
    date: 'Dec 3, 2024',
    title: '中国工程院工程科技高层研讨会-精准营养与微生物生态暨第五届益生菌、肠道微生物与人体健康国际研讨会',
    location: 'Wuxi, China',
  },
  {
    id: 2,
    date: 'Oct 25-28, 2024',
    title: 'Annual Academic Meeting of Chinese Association of Microbial Ecology',
    location: 'Qingdao, China',
  },
  {
    id: 3,
    date: 'Jul 12-17, 2024',
    title: 'NCCBB (National Computational Biology and Bioinformatic Conference)',
    location: 'China',
  },
  {
    id: 4,
    date: 'Jun 27-29, 2024',
    title: 'Life & Health Technology Expo 2024',
    location: 'Hong Kong',
  },
  {
    id: 5,
    date: 'May 20-22, 2023',
    title: 'China Gut Conference',
    location: 'Beijing, China',
  },
  {
    id: 6,
    date: 'Mar 9-10, 2023',
    title: 'GBA Conference on Maternal and Child Oral Health',
    location: '',
  },
]

const invitedLectures: Institution[] = [
  { id: 1, name: 'China Medical University', year: '2024' },
  { id: 2, name: 'Sun Yat-sen University', year: '2024' },
  { id: 3, name: 'The First Bethune Hospital of Jilin University', year: 'Sep 2024' },
  { id: 4, name: 'Nanchang University & Affiliated Hospitals', year: 'Aug 2024' },
  { id: 5, name: 'Fujian Cancer Hospital', year: 'Apr 2024' },
  { id: 6, name: 'Nanchang University', year: '2024' },
  { id: 7, name: 'Jiangnan University', year: '2022, 2023' },
  { id: 8, name: 'Hainan University', year: '2023' },
  { id: 9, name: 'CAS-QIBEBT', year: '2023' },
  { id: 10, name: 'Southern Medical University', year: '2023' },
  { id: 11, name: 'Inner Mongolia Agricultural University', year: '2023' },
]

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
/*  ANIMATION VARIANTS                                                 */
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
    transition: { delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

/* ------------------------------------------------------------------ */
/*  HELPER: presenter name color                                       */
/* ------------------------------------------------------------------ */
function PresenterName({ name }: { name: string }) {
  const isPI = name.includes('Dr. Shi Huang')
  return (
    <span style={{ color: isPI ? 'var(--color-accent-teal)' : 'var(--color-text-muted)' }}>
      {name}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function Awards() {
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
            // Recognition
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-display font-normal"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--color-text-primary)' }}
          >
            Awards & Talks
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mx-auto mt-6 text-[1.125rem] leading-[1.7]"
            style={{ color: 'var(--color-text-secondary)', maxWidth: '640px' }}
          >
            Our research has been recognized with prestigious awards, and our findings have been shared at leading conferences and institutions worldwide.
          </motion.p>
        </div>
      </section>

      {/* ============ AWARDS TIMELINE ============ */}
      <section style={{ backgroundColor: 'var(--color-bg-secondary)' }} className="section-padding">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-3"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              // Awards
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium"
              style={{ letterSpacing: '-0.01em', lineHeight: 1.2, color: 'var(--color-text-primary)' }}
            >
              Honors & Awards
            </motion.h2>
          </div>

          {/* Trophy image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mx-auto mb-16 max-w-[600px] overflow-hidden rounded-2xl"
            style={{ border: '1px solid rgba(56,189,168,0.12)' }}
          >
            <img
              src="/award-trophy.jpg"
              alt="Award trophy"
              className="w-full h-auto object-cover"
              style={{ maxHeight: '400px' }}
              loading="lazy"
            />
          </motion.div>

          {/* Timeline */}
          <div className="mx-auto max-w-[768px] relative">
            {/* Central line */}
            <div
              className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2"
              style={{ backgroundColor: 'rgba(56,189,168,0.12)' }}
            />

            {yearKeys.map((year, yi) => (
              <div key={year} className="relative mb-12 last:mb-0">
                {/* Year marker */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="relative z-10 flex items-center justify-center mb-8"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-accent-teal)' }}
                  >
                    <span className="font-mono text-[0.75rem] font-bold" style={{ color: '#060B14' }}>
                      {String(year).slice(-2)}
                    </span>
                  </div>
                  <span
                    className="absolute ml-14 left-1/2 font-display text-[1.5rem] font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {year}
                  </span>
                </motion.div>

                {/* Awards for this year */}
                <div className="space-y-4">
                  {awardsByYear[year].map((award, ai) => {
                    const isLeft = ai % 2 === 0
                    return (
                      <motion.div
                        key={award.id}
                        custom={ai + yi}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeUp}
                        className={`relative z-10 flex ${isLeft ? 'sm:justify-start' : 'sm:justify-end'} pl-12 sm:pl-0`}
                      >
                        {/* Connector dot on timeline */}
                        <div
                          className="absolute left-4 sm:left-1/2 top-5 w-2.5 h-2.5 rounded-full -translate-x-1/2"
                          style={{ backgroundColor: 'var(--color-accent-teal)' }}
                        />

                        {/* Card */}
                        <div
                          className="sm:w-[calc(50%-2rem)] rounded-2xl transition-all duration-300"
                          style={{
                            background: 'rgba(10, 21, 37, 0.72)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(56,189,168,0.12)',
                            padding: '1.25rem',
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
                          <div className="flex flex-wrap items-start gap-2 mb-2">
                            <h3 className="text-[1rem] font-semibold flex-1" style={{ color: 'var(--color-text-primary)' }}>
                              {award.title}
                            </h3>
                            <span
                              className="shrink-0 rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium"
                              style={{
                                backgroundColor: award.badgeColor,
                                color: award.badge === 'Finalist' || award.badge === 'Fellowship' ? '#FBBF24' : 'var(--color-accent-teal)',
                              }}
                            >
                              {award.badge}
                            </span>
                          </div>
                          <p className="text-[0.875rem]" style={{ color: 'var(--color-text-secondary)' }}>
                            {award.event}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.8rem]" style={{ color: 'var(--color-text-muted)' }}>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {award.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Trophy size={12} />
                              <PresenterName name={award.presenter} />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INVITED TALKS - CONFERENCES ============ */}
      <section style={{ backgroundColor: 'var(--color-bg-primary)' }} className="section-padding">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-3"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              // Conferences
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium"
              style={{ letterSpacing: '-0.01em', lineHeight: 1.2, color: 'var(--color-text-primary)' }}
            >
              Invited Conference Talks
            </motion.h2>
          </div>

          {/* Talk cards */}
          <div className="flex flex-col gap-3 max-w-[960px] mx-auto">
            {conferenceTalks.map((talk, i) => (
              <motion.div
                key={talk.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 rounded-2xl transition-all duration-300"
                style={{
                  background: 'rgba(10, 21, 37, 0.72)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(56,189,168,0.12)',
                  borderLeft: '3px solid transparent',
                  padding: '1.25rem 1.5rem',
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
                <div className="shrink-0 flex items-center gap-2 min-w-[140px]">
                  <Calendar size={14} style={{ color: 'var(--color-accent-cyan)' }} />
                  <span
                    className="font-mono text-[0.8rem] font-medium"
                    style={{ color: 'var(--color-accent-cyan)' }}
                  >
                    {talk.date}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-[0.95rem] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {talk.title}
                  </h3>
                  {talk.location && (
                    <p className="text-[0.8rem] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {talk.location}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INVITED LECTURES ============ */}
      <section style={{ backgroundColor: 'var(--color-bg-secondary)' }} className="section-padding">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-3"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              // Lectures
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium"
              style={{ letterSpacing: '-0.01em', lineHeight: 1.2, color: 'var(--color-text-primary)' }}
            >
              Invited Lectures at Universities & Institutions
            </motion.h2>
          </div>

          {/* Institution grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {invitedLectures.map((inst, i) => (
              <motion.div
                key={inst.id}
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
                  padding: '1rem 1.25rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(56,189,168,0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(45, 212, 168, 0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(56,189,168,0.12)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <h3 className="text-[0.95rem] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {inst.name}
                </h3>
                <p className="mt-1 text-[0.8rem]" style={{ color: 'var(--color-accent-cyan)' }}>
                  {inst.year}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section style={{ backgroundColor: 'var(--color-bg-primary)' }} className="section-padding">
        <div className="mx-auto max-w-[640px] px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium"
            style={{ letterSpacing: '-0.01em', lineHeight: 1.2, color: 'var(--color-text-primary)' }}
          >
            Interested in Our Research?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mt-4 text-[1rem] leading-[1.7]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Explore our publications or get in touch to learn more about our work.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/publications"
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
              View Publications <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
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
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
