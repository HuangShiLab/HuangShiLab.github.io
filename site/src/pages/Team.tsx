import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import { statsJson } from '@/data'

/* ------------------------------------------------------------------ */
/*  Easing                                                              */
/* ------------------------------------------------------------------ */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ------------------------------------------------------------------ */
/*  Particle Canvas (lightweight hero bg)                               */
/* ------------------------------------------------------------------ */
function ParticleCanvas({ opacity = 0.2, count = 30 }: { opacity?: number; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number; r: number; o: number
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.5 + 0.2,
    }))

    const animate = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      const pts = particlesRef.current
      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(45, 212, 168, ${p.o * opacity})`
        ctx.fill()
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(45, 212, 168, ${0.06 * opacity * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      ctx.restore()
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [opacity, count])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Fade-up wrapper                                                     */
/* ------------------------------------------------------------------ */
function FadeUp({
  children,
  delay = 0,
  className = '',
  y = 40,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: easeOutExpo }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section Label                                                       */
/* ------------------------------------------------------------------ */
function SectionLabel({ text }: { text: string }) {
  return (
    <span
      className="text-[0.75rem] font-medium uppercase tracking-[0.08em]"
      style={{ color: 'var(--color-accent-teal)' }}
    >
      {text}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Tilt Portrait (PI photo with hover tilt)                            */
/* ------------------------------------------------------------------ */
function TiltPortrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(600px) rotateX(0deg) rotateY(0deg)')

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(
      `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`
    )
  }

  const handleMouseLeave = () => {
    setTransform('perspective(600px) rotateX(0deg) rotateY(0deg)')
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-300 ease-out"
      style={{ transform }}
    >
      <div
        className="rounded-[20px] p-1.5"
        style={{
          backgroundColor: 'var(--color-bg-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 166, 0.12)',
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full rounded-[16px] object-cover"
          style={{ aspectRatio: '1/1' }}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Member Data                                                         */
/* ------------------------------------------------------------------ */
const members = [
  {
    name: 'Yufeng Zhang',
    role: 'PhD Student',
    photo: 'https://github.com/HuangShiLab/HuangShiLab.github.io/assets/170502144/05bcf627-5cdc-4c08-8feb-2055cf40e942',
    bio: 'Computer Science background. Focuses on bioinformatics, strain-level profiling and functional prediction in low-microbial-biomass samples.',
  },
  {
    name: 'Yuesong Jiang',
    role: 'PhD Student',
    photo: 'https://github.com/HuangShiLab/HuangShiLab.github.io/assets/170502144/94f1f0d1-057e-4d2c-9000-b2a6cbd0b04f',
    bio: 'Pharmacy background. Benchmarking bioinformatic tools for metagenomics under high host contamination.',
  },
  {
    name: 'Shuwen Hou',
    role: 'PhD Student',
    photo: 'https://github.com/HuangShiLab/HuangShiLab.github.io/assets/170502144/0b24d91d-c783-4f0f-ba7e-98ca5bf60215',
    bio: 'BSc Biochemistry at HKU. Projects on low-biomass human microbiome analysis.',
  },
  {
    name: 'Gang Wang',
    role: 'PhD Student',
    photo: 'https://github.com/HuangShiLab/HuangShiLab.github.io/assets/170502144/38064b34-c19c-4952-835d-105042f0a3c1',
    bio: 'Oral Medicine background. Research on oral microbiota and neurodegenerative diseases (Alzheimer\'s).',
  },
  {
    name: 'Caihao Sun',
    role: 'PhD Student',
    photo: 'https://github.com/user-attachments/assets/0f3957ed-7827-470f-a08d-da3b1f78c0f2',
    bio: 'BSc Aerospace, MSc AI. Research: deep learning, LLM, bioinformatics.',
  },
  {
    name: 'Xinyue Zhang',
    role: 'PhD Student',
    photo: 'https://github.com/user-attachments/assets/c6ec4e66-79e8-4ae0-80f6-71d4c8fd9bf7',
    bio: 'Dentistry and microbiology background. Research on antimicrobial resistance in salivary bacterial microbiota.',
  },
  {
    name: 'Jing-Yi Zhang',
    role: 'PhD Student',
    photo: 'https://github.com/user-attachments/assets/8e252fb9-26f6-421c-aaf4-f1840a8a1997',
    bio: 'BS+MS Ecology at Sun Yat-sen University. Exploring Genome-scale Metabolic Models.',
  },
  {
    name: 'Zhengting Wang',
    role: 'MPhil Student',
    photo: 'https://github.com/user-attachments/assets/08789335-d029-4931-ad25-dfde7fc9221c',
    bio: 'Food Science background. Studies probiotics and microbiome using multi-omics approaches.',
  },
]

const piHighlights = [
  'Published in Nature Methods, Cell Host Microbe, Microbiome, Genome Biology, ISMEJ',
  '7 authorized microbiome-related patents (2 international)',
  'NSFC and HMRF funded research',
  'Editorial board for iMeta, mSystems, Innovation',
]

const piMetrics = [
  { label: 'Publications', value: String(statsJson.papers_count) },
  { label: 'H-Index', value: String(statsJson.h_index_all) },
  { label: 'Patents', value: String(statsJson.patent_count) },
  { label: 'Editorial Roles', value: '3' },
]

/* ------------------------------------------------------------------ */
/*  Member Card                                                         */
/* ------------------------------------------------------------------ */
function MemberCard({
  member,
  index,
}: {
  member: (typeof members)[0]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: easeOutExpo }}
      className="glass-card overflow-hidden transition-all duration-300 group cursor-pointer"
      whileHover={{ y: -6 }}
    >
      <div className="overflow-hidden">
        <img
          src={member.photo}
          alt={member.name}
          className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          style={{ aspectRatio: '1/1' }}
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3
          className="text-[1rem] font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {member.name}
        </h3>
        <p
          className="text-[0.8rem] uppercase tracking-[0.04em] mt-0.5"
          style={{ color: 'var(--color-accent-teal)' }}
        >
          {member.role}
        </p>
        <div
          className="my-3"
          style={{ height: '1px', backgroundColor: 'rgba(56, 189, 166, 0.08)' }}
        />
        <p
          className="text-[0.8rem] leading-[1.6] line-clamp-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {member.bio}
        </p>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Team Page                                                      */
/* ------------------------------------------------------------------ */
export default function Team() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* ============================================================ */}
      {/*  SECTION 1: Hero                                             */}
      {/* ============================================================ */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '60vh' }}
      >
        <ParticleCanvas opacity={0.2} count={30} />
        <div className="absolute inset-0 gradient-hero" style={{ zIndex: 1 }} />
        <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <SectionLabel text="// Team" />
          </motion.div>
          <motion.h1
            className="font-display mt-4"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--color-text-primary)',
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: easeOutExpo }}
          >
            Meet Our Team
          </motion.h1>
          <motion.p
            className="mt-6 mx-auto max-w-[560px] text-[1.125rem] leading-[1.7]"
            style={{ color: 'var(--color-text-secondary)' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: easeOutExpo }}
          >
            A diverse group of researchers united by our passion for decoding the microbial world.
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 2: PI Profile                                       */}
      {/* ============================================================ */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 lg:gap-16 items-start">
            {/* Left — Portrait */}
            <FadeUp>
              <div>
                <TiltPortrait src="https://github.com/HuangShiLab/HuangShiLab.github.io/assets/170502144/1fe82cbd-fbb9-4e57-bc04-e63928e89cc7" alt="Dr. HUANG Shi" />
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    { label: `H-Index: ${statsJson.h_index_all}` },
                    { label: `${statsJson.papers_count}+ Papers` },
                    { label: `${statsJson.patent_count} Patents` },
                  ].map((badge) => (
                    <span
                      key={badge.label}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-[0.75rem] font-medium"
                      style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        color: 'var(--color-accent-teal)',
                      }}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Right — Bio */}
            <div>
              <FadeUp delay={0.1}>
                <h2
                  className="font-display"
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Dr. HUANG Shi
                </h2>
              </FadeUp>
              <FadeUp delay={0.15}>
                <p
                  className="text-[1.125rem] mt-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Assistant Professor
                </p>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p
                  className="text-[1rem] mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Faculty of Dentistry, The University of Hong Kong
                </p>
              </FadeUp>

              <FadeUp delay={0.25}>
                <div
                  className="my-6"
                  style={{ height: '1px', backgroundColor: 'rgba(56, 189, 166, 0.12)' }}
                />
              </FadeUp>

              <FadeUp delay={0.3}>
                <p
                  className="text-[1rem] leading-[1.8]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Dr. HUANG Shi has been engaged in microbiome research for over 10 years and made
                  significant contributions in many frontiers in microbiome science. He established
                  microbiome-based indices for the diagnosis and prediction of chronic diseases (dental
                  caries, periodontal disease, gut health, skin health, aging). He first demonstrated
                  that onset of chronic diseases can be predicted by the human microbiome before
                  clinical symptoms emerge. He pioneered the 2bRAD-M sequencing strategy for
                  low-biomass samples. He also studies adaptive co-evolution of probiotics and native
                  gut microbiome.
                </p>
              </FadeUp>

              {/* Metrics Grid */}
              <FadeUp delay={0.35}>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {piMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="glass-card p-4 flex flex-col"
                    >
                      <span
                        className="text-[0.75rem] uppercase tracking-[0.05em]"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {metric.label}
                      </span>
                      <span className="font-mono text-[1.5rem] font-medium gradient-text-teal mt-1">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeUp>

              {/* Highlights */}
              <FadeUp delay={0.4}>
                <div className="flex flex-col gap-3 mt-6">
                  {piHighlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle
                        size={16}
                        className="mt-1 shrink-0"
                        style={{ color: 'var(--color-accent-teal)' }}
                      />
                      <span
                        className="text-[0.875rem]"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeUp>

              {/* Links */}
              <FadeUp delay={0.45}>
                <div className="flex flex-wrap items-center gap-6 mt-6">
                  <a
                    href="https://facdent.hku.hk/about/staff-profile.php?shortname=shihuang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium transition-colors duration-300"
                    style={{ color: 'var(--color-accent-teal)' }}
                  >
                    HKU Profile
                    <ExternalLink size={14} />
                  </a>
                  <a
                    href="https://scholar.google.com/citations?user=ShiHuang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium transition-colors duration-300"
                    style={{ color: 'var(--color-accent-teal)' }}
                  >
                    Google Scholar
                    <ExternalLink size={14} />
                  </a>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 3: Current Members                                  */}
      {/* ============================================================ */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <FadeUp className="mb-10">
            <SectionLabel text="// Members" />
            <h2
              className="font-display mt-3"
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                color: 'var(--color-text-primary)',
              }}
            >
              Current Lab Members
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 4: Past Members + Join CTA                          */}
      {/* ============================================================ */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Past Members */}
          <FadeUp>
            <h2
              className="font-display mb-6"
              style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                color: 'var(--color-text-primary)',
              }}
            >
              Past Members
            </h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div
              className="rounded-xl p-4 max-w-md"
              style={{
                border: '1px solid rgba(56, 189, 166, 0.12)',
                backgroundColor: 'var(--color-bg-tertiary)',
              }}
            >
              <p
                className="text-[1rem] font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Shuaiming Jiang
              </p>
              <p
                className="text-[0.875rem] mt-0.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Now at Hainan University, China
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div
              className="rounded-xl p-4 max-w-md mt-4"
              style={{
                border: '1px solid rgba(56, 189, 166, 0.12)',
                backgroundColor: 'var(--color-bg-tertiary)',
              }}
            >
              <p
                className="text-[1rem] font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Enoch Kao
              </p>
              <p
                className="text-[0.875rem] mt-0.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Now pursuing PhD at Faculty of Medicine, HKU
              </p>
            </div>
          </FadeUp>

          {/* Divider */}
          <div
            className="my-16 lg:my-24"
            style={{
              height: '1px',
              backgroundColor: 'rgba(56, 189, 166, 0.08)',
            }}
          />

          {/* Join CTA */}
          <div className="max-w-[520px] mx-auto text-center">
            <FadeUp>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  color: 'var(--color-text-primary)',
                }}
              >
                Join Our Team
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p
                className="mt-4 text-[1rem] leading-[1.7]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                We are always looking for passionate researchers. If you're interested in microbiome
                research, metagenomics, or bioinformatics, get in touch.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-3.5 rounded-full text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #2DD4A8 0%, #22D3EE 100%)',
                    color: '#060B14',
                  }}
                >
                  Contact Us
                </Link>
                <Link
                  to="/research"
                  className="inline-flex items-center px-8 py-3.5 rounded-full text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300"
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
                  View Research
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  )
}
