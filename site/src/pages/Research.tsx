import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dna,
  Microscope,
  FlaskConical,
  BrainCircuit,
  BookOpen,
  Star,
  FileCheck,
  TrendingUp,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { statsJson } from '@/data'

/* ------------------------------------------------------------------ */
/*  Easing                                                              */
/* ------------------------------------------------------------------ */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]
const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number]

/* ------------------------------------------------------------------ */
/*  Particle Canvas (lightweight hero bg)                               */
/* ------------------------------------------------------------------ */
function ParticleCanvas({ opacity = 0.3, count = 60 }: { opacity?: number; count?: number }) {
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
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
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
            ctx.strokeStyle = `rgba(45, 212, 168, ${0.08 * opacity * (1 - dist / 120)})`
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
/*  Research Area Data                                                  */
/* ------------------------------------------------------------------ */
const researchAreas = [
  {
    id: 'metagenomics',
    label: 'Metagenomics',
    icon: Dna,
    title: 'Metagenomics Method Development',
    description:
      'Developing and benchmarking cutting-edge metagenomic tools to unlock the hidden microbial world. We focus on creating novel sequencing strategies that overcome the limitations of traditional methods, particularly for challenging low-biomass clinical samples.',
    focus: [
      'Novel metagenomic sequencing strategies (2bRAD-M) for low-biomass samples',
      'Species-resolved microbiota profiling of clinical specimens (FFPE tumor tissue)',
      'Benchmarking bioinformatic tools for metagenomic analysis',
      'Phylogeny-aware analysis of microbial communities',
      'Strain-level profiling and functional prediction pipelines',
    ],
    image: '/research-metagenomics.jpg',
  },
  {
    id: 'microbiome',
    label: 'Microbiome',
    icon: Microscope,
    title: 'Human Microbiome & Chronic Diseases',
    description:
      'We established a range of microbiome-based indices for the diagnosis and prediction of chronic diseases including dental caries, periodontal disease, gut health conditions, skin health, and aging. We were the first to demonstrate that the onset of chronic diseases can be predicted by the human microbiome before clinical symptoms emerge.',
    focus: [
      'Microbiome-based disease prediction models for early intervention',
      'Oral microbiota characterization and caries risk assessment',
      'Gut microbiome analysis for IBD and metabolic disease prediction',
      'Skin microbiome index for atopic dermatitis assessment',
      'Microbiome aging clocks and longevity research',
      'Salivary microbiota as non-invasive diagnostic biomarkers',
    ],
    image: '/research-microbiome.jpg',
  },
  {
    id: 'probiotics',
    label: 'Probiotics',
    icon: FlaskConical,
    title: 'Probiotics & Adaptive Co-evolution',
    description:
      'We actively exploit the adaptive co-evolution between ingested probiotic bacteria and resident gut microbiota to develop personalized probiotic solutions that offer long-lasting efficacious probiotics for human health. Our work reveals how the native microbiome shapes probiotic genetic evolution in the gut.',
    focus: [
      'Adaptive genetic evolution of probiotics within host gut environments',
      'Native microbiome-probiotic interaction mechanisms',
      'Structural variation of exogenous probiotics during colonization',
      'Personalized probiotic solutions for gut health',
      'Prebiotic-probiotic synergistic effects on microbiome stability',
    ],
    image: '/research-probiotics.jpg',
  },
  {
    id: 'ml',
    label: 'ML & AI',
    icon: BrainCircuit,
    title: 'Machine Learning in Microbiome Data',
    description:
      'Applying cutting-edge machine learning and artificial intelligence to extract meaningful insights from complex, high-dimensional microbiome datasets. From deep learning models for taxonomic profiling to large language models for functional annotation, we push the boundaries of computational microbiology.',
    focus: [
      'Deep learning models for microbiome classification and prediction',
      'Large language models (LLMs) for bioinformatics and functional annotation',
      'Strain-resolved taxonomic profiling using AI',
      'Functional prediction algorithms for low-biomass samples',
      'Multi-omics data integration with neural networks',
    ],
    image: '/research-ml.jpg',
  },
]

/* ------------------------------------------------------------------ */
/*  Publication Data                                                    */
/* ------------------------------------------------------------------ */
const publicationGroups = [
  {
    id: 'metagenomics',
    title: 'Metagenomics Method Development',
    icon: Dna,
    papers: [
      { authors: 'Sun Z#, Huang S#*, et al.', title: '2bRAD-M', journal: 'Genome Biology', year: '2022' },
      { authors: 'Zhu Q#, Huang S#, et al.', title: 'Phylogeny-Aware Analysis', journal: 'mSystems', year: '2022' },
      { authors: 'Sun Z#, Huang Shi#, et al.', title: 'Benchmarking metagenomic profilers', journal: 'Nature Methods', year: '2021' },
    ],
  },
  {
    id: 'microbiome',
    title: 'Human Microbiome & Chronic Diseases',
    icon: Microscope,
    papers: [
      { authors: 'Teng F#, Yang F#, Huang S#.', title: 'Early childhood caries prediction', journal: 'Cell Host Microbe', year: '2015' },
      { authors: 'Yang F#, et al.', title: 'Single-tooth resolved caries prediction', journal: 'Cell Host Microbe', year: '2025' },
      { authors: 'Huang Shi, et al.', title: 'Microbiome age prediction', journal: 'mSystems', year: '2020' },
      { authors: 'Sun Z#, Huang Shi#, et al.', title: 'Skin microbiome index', journal: 'mSystems', year: '2019' },
      { authors: 'Li S#, Huang Shi#.', title: 'Salivary microbiota for caries', journal: 'Frontiers', year: '2021' },
    ],
  },
  {
    id: 'probiotics',
    title: 'Probiotics & Adaptive Co-evolution',
    icon: FlaskConical,
    papers: [
      { authors: 'Jiang S#, Huang S#, et al.', title: 'Gut microbiota & probiotic SV', journal: 'Gut Microbes', year: '2025' },
      { authors: 'Huang Shi, et al.', title: 'L. plantarum HNU082 evolution', journal: 'Microbiome', year: '2021' },
      { authors: 'Ma C#, et al.', title: 'Universal adaptive mutations', journal: 'Communications Biology', year: '2021' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Compact Publication Card                                            */
/* ------------------------------------------------------------------ */
function CompactPubCard({
  authors,
  title,
  journal,
}: {
  authors: string
  title: string
  journal: string
}) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5 transition-all duration-300 cursor-pointer group"
      style={{ borderBottom: '1px solid rgba(56, 189, 166, 0.08)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderLeft = '2px solid var(--color-accent-teal)'
        e.currentTarget.style.paddingLeft = '12px'
        e.currentTarget.style.backgroundColor = 'rgba(45,212,168,0.03)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderLeft = '2px solid transparent'
        e.currentTarget.style.paddingLeft = '0px'
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[0.875rem] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </p>
        <p className="text-[0.75rem] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {authors.split('Huang').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <span style={{ color: 'var(--color-accent-teal)' }}>Huang</span>}
            </span>
          ))}
        </p>
      </div>
      <span
        className="font-display italic text-[0.8rem] shrink-0 ml-0 sm:ml-4"
        style={{ color: 'var(--color-accent-cyan)' }}
      >
        {journal}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Accordion Group                                                     */
/* ------------------------------------------------------------------ */
function AccordionGroup({
  group,
  isOpen,
  onToggle,
  index,
}: {
  group: (typeof publicationGroups)[0]
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const Icon = group.icon

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  return (
    <FadeUp delay={index * 0.08}>
      <div className="glass-card overflow-hidden transition-all duration-300">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-300"
          style={{ backgroundColor: isOpen ? 'rgba(45,212,168,0.03)' : 'transparent' }}
        >
          <div className="flex items-center gap-3">
            <Icon size={22} style={{ color: 'var(--color-accent-teal)' }} />
            <span className="text-[1.125rem] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {group.title}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: easeSmooth }}
          >
            <ChevronDown size={20} style={{ color: 'var(--color-text-secondary)' }} />
          </motion.div>
        </button>
        <div
          className="overflow-hidden transition-all duration-400"
          style={{ height, transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <div ref={contentRef} className="px-6 pb-5">
            {group.papers.map((paper, i) => (
              <CompactPubCard key={i} {...paper} />
            ))}
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

/* ------------------------------------------------------------------ */
/*  Stat Block                                                          */
/* ------------------------------------------------------------------ */
function StatBlock({
  icon: Icon,
  number,
  label,
  delay = 0,
}: {
  icon: typeof BookOpen
  number: string
  label: string
  delay?: number
}) {
  return (
    <FadeUp delay={delay} className="flex flex-col items-center text-center gap-2">
      <Icon size={24} style={{ color: 'var(--color-accent-teal)' }} />
      <span className="font-mono text-[2.5rem] font-medium gradient-text-teal leading-tight">{number}</span>
      <span
        className="text-[0.875rem] uppercase tracking-[0.05em]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </span>
    </FadeUp>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Research Page                                                  */
/* ------------------------------------------------------------------ */
export default function Research() {
  const [activeTab, setActiveTab] = useState(0)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* ============================================================ */}
      {/*  SECTION 1: Hero                                             */}
      {/* ============================================================ */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '70vh' }}
      >
        <ParticleCanvas opacity={0.3} count={60} />
        <div
          className="absolute inset-0 gradient-hero"
          style={{ zIndex: 1 }}
        />
        <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <SectionLabel text="// Research" />
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
            Our Research
          </motion.h1>
          <motion.p
            className="mt-6 mx-auto max-w-[680px] text-[1.125rem] leading-[1.7]"
            style={{ color: 'var(--color-text-secondary)' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: easeOutExpo }}
          >
            From metagenomics method development to machine learning applications, our
            interdisciplinary research pushes the boundaries of microbiome science.
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 2: Research Areas (Tabs)                            */}
      {/* ============================================================ */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-10">
              <SectionLabel text="// Research Areas" />
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
                Four Pillars of Our Research
              </h2>
            </div>
          </FadeUp>

          {/* Tab Bar */}
          <FadeUp delay={0.1}>
            <div className="flex justify-center mb-10">
              <div
                className="inline-flex rounded-xl overflow-hidden"
                style={{
                  border: '1px solid rgba(56, 189, 166, 0.12)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                }}
              >
                {researchAreas.map((area, i) => (
                  <button
                    key={area.id}
                    onClick={() => setActiveTab(i)}
                    className="relative px-4 sm:px-6 py-3 text-[0.875rem] font-medium uppercase tracking-[0.04em] transition-all duration-300"
                    style={{
                      color:
                        activeTab === i
                          ? 'var(--color-text-primary)'
                          : 'var(--color-text-secondary)',
                    }}
                  >
                    {activeTab === i && (
                      <motion.div
                        layoutId="researchTabBg"
                        className="absolute inset-1 rounded-[10px]"
                        style={{
                          backgroundColor: 'var(--color-bg-glass)',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                        }}
                        transition={{ duration: 0.3, ease: easeSmooth }}
                      />
                    )}
                    <span className="relative z-10">{area.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: easeOutExpo }}
                className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-start"
              >
                {/* Left — Text */}
                <div>
                  {(() => {
                    const area = researchAreas[activeTab]
                    const Icon = area.icon
                    return (
                      <>
                        <div
                          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
                          style={{ backgroundColor: 'rgba(45, 212, 168, 0.1)' }}
                        >
                          <Icon size={32} style={{ color: 'var(--color-accent-teal)' }} />
                        </div>
                        <h3
                          className="font-display mb-4"
                          style={{
                            fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                            fontWeight: 500,
                            letterSpacing: '-0.01em',
                            lineHeight: 1.2,
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {area.title}
                        </h3>
                        <p
                          className="text-[1rem] leading-[1.7]"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {area.description}
                        </p>
                        <div className="flex flex-col gap-3 mt-6">
                          {area.focus.map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div
                                className="mt-2 w-1 h-1 rounded-full shrink-0"
                                style={{ backgroundColor: 'var(--color-accent-teal)' }}
                              />
                              <span className="text-[0.9rem]" style={{ color: 'var(--color-text-secondary)' }}>
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Link
                          to="/publications"
                          className="inline-flex items-center gap-2 mt-6 text-[0.875rem] font-medium transition-all duration-300 group"
                          style={{ color: 'var(--color-accent-teal)' }}
                        >
                          See Publications
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </>
                    )
                  })()}
                </div>

                {/* Right — Image */}
                <div className="glass-card p-2 overflow-hidden">
                  <img
                    src={researchAreas[activeTab].image}
                    alt={researchAreas[activeTab].title}
                    className="w-full rounded-[14px] object-cover"
                    style={{ aspectRatio: '16/10' }}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 3: Stats Strip                                       */}
      {/* ============================================================ */}
      <section
        className="py-14 lg:py-16"
        style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            <StatBlock icon={BookOpen} number={`${statsJson.papers_count}+`} label="Peer-Reviewed Papers" delay={0} />
            <StatBlock icon={Star} number={String(statsJson.first_author_count)} label="First/Corresponding Author" delay={0.12} />
            <StatBlock icon={FileCheck} number="5" label="Patents Granted" delay={0.24} />
            <StatBlock icon={TrendingUp} number={String(statsJson.h_index_all)} label="H-Index" delay={0.36} />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 4: Publications by Area (Accordion)                 */}
      {/* ============================================================ */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <FadeUp className="mb-10">
            <SectionLabel text="// Selected Papers" />
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
              Publications by Research Area
            </h2>
          </FadeUp>

          <div className="flex flex-col gap-4">
            {publicationGroups.map((group, i) => (
              <AccordionGroup
                key={group.id}
                group={group}
                index={i}
                isOpen={openAccordion === group.id}
                onToggle={() =>
                  setOpenAccordion(openAccordion === group.id ? null : group.id)
                }
              />
            ))}
          </div>

          <FadeUp delay={0.2} className="text-center mt-10">
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 text-[0.875rem] font-medium transition-all duration-300 group"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              View All Publications
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 5: Collaboration CTA                                 */}
      {/* ============================================================ */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="mx-auto max-w-[640px] px-4 sm:px-6 text-center">
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
              Interested in Collaborating?
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p
              className="mt-4 text-[1rem] leading-[1.7]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              We welcome collaborations with researchers, clinicians, and industry partners.
              Reach out to discuss potential projects.
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
                to="/team"
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
                View Our Team
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
