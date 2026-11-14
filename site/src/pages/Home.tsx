import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { statsJson } from '@/data'
import {
  Dna, Microscope, FlaskConical, BrainCircuit,
  CheckCircle, Trophy, ChevronDown, ArrowRight,
} from 'lucide-react'
import ParticleCanvas from '../components/home/ParticleCanvas'

/* ───────── helpers ───────── */
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, inView }
}

function SectionLabel({ text }: { text: string }) {
  return (
    <span
      className="block text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-3"
      style={{ color: 'var(--color-accent-teal)' }}
    >
      {text}
    </span>
  )
}

/* ───────── Section 1: Hero ───────── */
function HeroSection() {
  const [scrolled, setScrolled] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300)
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Particle canvas background */}
      <ParticleCanvas />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(45,212,168,0.08) 0%, transparent 60%)',
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <p
          className={`text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-6 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ color: 'var(--color-accent-teal)', transitionDelay: '0.1s' }}
        >
          // Microbiome Research Lab
        </p>

        <h1
          className={`font-display font-light leading-[1.05] transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            letterSpacing: '-0.03em',
            transitionDelay: '0.3s',
          }}
        >
          <span className="gradient-text-teal">HuangShiLab</span>
          <br />
          <span className="gradient-text-teal">Decoding the Microbial World</span>
        </h1>

        <p
          className={`mt-6 text-[1.125rem] leading-[1.7] max-w-[640px] mx-auto transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ color: 'var(--color-text-secondary)', transitionDelay: '1.2s' }}
        >
          Pioneering metagenomics methods, predictive microbiome models, and personalized probiotic solutions at The University of Hong Kong
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '1.5s' }}
        >
          <Link
            to="/research"
            className="px-8 py-3.5 rounded-full text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300 hover:scale-[1.04] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #2DD4A8 0%, #22D3EE 100%)',
              color: '#060B14',
              boxShadow: '0 0 30px rgba(45, 212, 168, 0.3)',
            }}
          >
            Explore Our Research
          </Link>
          <Link
            to="/team"
            className="px-8 py-3.5 rounded-full text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300 hover:scale-[1.04]"
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
            Meet the Team
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300"
        style={{ opacity: scrolled ? 0 : 1 }}
      >
        <ChevronDown
          size={24}
          className="animate-bounce-down"
          style={{ color: 'var(--color-text-muted)' }}
        />
      </div>

      {/* Institution badge */}
      <div className="absolute bottom-8 left-4 sm:left-8 z-10 flex items-center gap-3">
        <img
          src="/hku-logo.png"
          alt="HKU"
          className="h-10 w-10 object-contain opacity-80"
        />
        <span className="text-[0.75rem]" style={{ color: 'var(--color-text-muted)' }}>
          Faculty of Dentistry
        </span>
      </div>
    </section>
  )
}

/* ───────── Section 2: Stats ───────── */
function StatCounter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!inView || hasAnimated.current) return
    hasAnimated.current = true
    const duration = 2000
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out-expo
      const eased = 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, target])

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <span
        className="font-mono font-medium gradient-text-teal"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
      >
        {count}{suffix}
      </span>
      <span
        className="text-[0.875rem] uppercase tracking-[0.05em]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </span>
    </div>
  )
}

function StatsSection() {
  return (
    <section
      className="w-full py-10"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative">
          {[
            { target: statsJson.papers_count, suffix: '+', label: 'Research Papers' },
            { target: statsJson.h_index_all, label: 'H-Index' },
            { target: statsJson.first_author_count, label: 'First/Corresponding Author Papers' },
            { target: 5, label: 'Patents Granted' },
          ].map((stat, i, arr) => (
            <div key={stat.label} className="relative flex items-center justify-center">
              <StatCounter {...stat} />
              {i < arr.length - 1 && (
                <div
                  className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px"
                  style={{ backgroundColor: 'rgba(56, 189, 166, 0.12)' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── Section 3: About PI ───────── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-300 ease-out"
      style={{
        background: 'rgba(10, 21, 37, 0.72)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1px solid rgba(56, 189, 166, 0.12)',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}

function AboutPISection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 })

  return (
    <section ref={ref} className="section-padding" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <SectionLabel text="// Principal Investigator" />
            <h2
              className="font-display font-medium leading-[1.2] mb-2"
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                letterSpacing: '-0.01em',
                color: 'var(--color-text-primary)',
              }}
            >
              Dr. HUANG Shi
            </h2>
            <p className="text-[1rem] mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Assistant Professor, Faculty of Dentistry, The University of Hong Kong
            </p>
            <p className="max-w-[520px] leading-[1.7] mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Dr. HUANG Shi has been engaged in microbiome research for over 10 years, establishing microbiome-based indices for disease diagnosis and prediction. He pioneered the 2bRAD-M sequencing strategy for low-biomass samples and demonstrated that chronic disease onset can be predicted by the human microbiome before clinical symptoms emerge.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {[
                'Published in Nature Methods, Cell Host Microbe, Microbiome, Genome Biology, ISMEJ',
                '7 authorized microbiome-related patents (2 international)',
                'Editorial board member for iMeta, mSystems, Innovation',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent-teal)' }} />
                  <span className="text-[0.875rem]" style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/team"
              className="inline-flex items-center gap-2 text-[0.875rem] font-medium transition-all duration-300 group"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              <span className="relative">
                Full Profile
                <span className="absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Image */}
          <div className={`transition-all duration-800 delay-200 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <TiltCard>
              <div className="p-1">
                <img
                  src="https://github.com/HuangShiLab/HuangShiLab.github.io/assets/170502144/1fe82cbd-fbb9-4e57-bc04-e63928e89cc7"
                  alt="Dr. HUANG Shi"
                  className="w-full aspect-square object-cover rounded-[16px]"
                />
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── Section 4: Research Highlights ───────── */
const researchCards = [
  {
    icon: Dna,
    title: 'Metagenomics Methods',
    description: 'Developing and benchmarking cutting-edge metagenomic sequencing strategies including 2bRAD-M for low-biomass clinical samples.',
    image: '/research-metagenomics.jpg',
  },
  {
    icon: Microscope,
    title: 'Microbiome & Disease',
    description: 'Establishing microbiome-based indices for predicting chronic diseases before clinical symptoms emerge — from dental caries to aging.',
    image: '/research-microbiome.jpg',
  },
  {
    icon: FlaskConical,
    title: 'Probiotics & Co-evolution',
    description: 'Exploring how ingested probiotics adaptively co-evolve with native gut microbiota for long-lasting personalized health solutions.',
    image: '/research-probiotics.jpg',
  },
  {
    icon: BrainCircuit,
    title: 'Machine Learning',
    description: 'Applying deep learning and large language models to extract meaningful patterns from complex microbiome datasets.',
    image: '/research-ml.jpg',
  },
]

function ResearchSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={ref} className="section-padding" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <SectionLabel text="// Research" />
          <h2
            className={`font-display leading-[1.15] mb-4 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
            }}
          >
            Four Pillars of Discovery
          </h2>
          <p
            className={`text-[1.125rem] leading-[1.7] transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Our interdisciplinary approach combines metagenomics, bioinformatics, machine learning, and microbiology to decode the hidden world within us.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {researchCards.map((card, i) => {
            const Icon = card.icon
            return (
              <Link
                key={card.title}
                to="/research"
                className={`group glass-card glass-card-hover p-6 transition-all duration-600 ${inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-96'}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                {/* Card image */}
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Icon */}
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                  style={{ border: '1px solid rgba(45, 212, 168, 0.2)' }}
                >
                  <Icon size={24} style={{ color: 'var(--color-accent-teal)' }} />
                </div>

                <h3 className="text-[1.125rem] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  {card.title}
                </h3>
                <p className="text-[0.875rem] leading-[1.6] mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {card.description}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-[0.75rem] font-medium uppercase transition-all duration-300"
                  style={{ color: 'var(--color-accent-teal)' }}
                >
                  Learn more
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ───────── Section 5: Featured Publications ───────── */
const publications = [
  {
    authors: 'Sun Z#, Huang S#*, et al.',
    title: 'Species-resolved sequencing of low-biomass or degraded microbiomes using 2bRAD-M',
    journal: 'Genome Biology',
    year: '2022',
  },
  {
    authors: 'Sun Z#, Huang Shi#, et al.',
    title: 'Benchmarking metagenomic profilers',
    journal: 'Nature Methods',
    year: '2021',
  },
  {
    authors: 'Teng F#, Yang F#, Huang S#.',
    title: 'Early childhood caries prediction',
    journal: 'Cell Host and Microbe',
    year: '2015',
  },
  {
    authors: 'Huang Shi, et al.',
    title: 'Candidate probiotic L. plantarum HNU082 evolution',
    journal: 'Microbiome',
    year: '2021',
  },
  {
    authors: 'Yang F#, et al.',
    title: 'Single-tooth resolved caries prediction',
    journal: 'Cell Host and Microbe',
    year: '2025',
  },
  {
    authors: 'Zhang CC, et al.',
    title: 'Arabinan utilization & constipation',
    journal: 'Cell Host & Microbe',
    year: '2023',
  },
]

function PublicationsSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15 })
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return
    const card = scrollRef.current.children[index] as HTMLElement
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
    setActiveIndex(index)
  }

  return (
    <section ref={ref} className="section-padding" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <SectionLabel text="// Publications" />
            <h2
              className="font-display font-medium leading-[1.2]"
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                letterSpacing: '-0.01em',
                color: 'var(--color-text-primary)',
              }}
            >
              Recent Papers
            </h2>
          </div>
          <Link
            to="/publications"
            className="inline-flex items-center gap-2 text-[0.875rem] font-medium transition-all duration-300 shrink-0"
            style={{ color: 'var(--color-accent-teal)' }}
          >
            View All Publications
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => {
              const el = e.currentTarget
              const scrollLeft = el.scrollLeft
              const cardWidth = el.children[0]?.clientWidth ?? 300
              const idx = Math.round(scrollLeft / (cardWidth + 16))
              setActiveIndex(Math.min(idx, publications.length - 1))
            }}
          >
            {publications.map((pub, i) => (
              <div
                key={i}
                className={`snap-start shrink-0 w-[85vw] sm:w-[45vw] lg:w-[calc(33.333%-11px)] glass-card p-5 transition-all duration-600 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                style={{
                  transitionDelay: `${i * 0.1}s`,
                  minHeight: '220px',
                }}
              >
                {/* Journal badge */}
                <div className="flex justify-end mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-[0.7rem] font-medium"
                    style={{
                      backgroundColor: 'var(--color-bg-tertiary)',
                      color: 'var(--color-accent-cyan)',
                      border: '1px solid rgba(34, 211, 238, 0.2)',
                    }}
                  >
                    {pub.journal}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-[0.95rem] font-medium leading-[1.5] line-clamp-3 mb-3"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {pub.title}
                </h3>

                {/* Authors */}
                <p className="text-[0.8rem] mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  {pub.authors.split(' ').map((word, wi) => {
                    if (word.includes('Huang') || word === 'S#*,' || word === 'S#.' || word === 'S#*' || word === 'Shi#,' || word === 'Shi#.' || word === 'S#,') {
                      return <span key={wi} style={{ color: 'var(--color-accent-teal)' }}>{word} </span>
                    }
                    return word + ' '
                  })}
                </p>

                {/* Journal + Year */}
                <p className="text-[0.8rem] italic font-display" style={{ color: 'var(--color-text-secondary)' }}>
                  {pub.journal} &middot; {pub.year}
                </p>
              </div>
            ))}
          </div>

          {/* Arrow buttons */}
          <button
            onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 items-center justify-center rounded-full transition-all duration-300"
            style={{
              border: '1px solid rgba(45, 212, 168, 0.3)',
              color: 'var(--color-accent-teal)',
              backgroundColor: 'rgba(6, 11, 20, 0.8)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-teal)'
              e.currentTarget.style.color = '#060B14'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(6, 11, 20, 0.8)'
              e.currentTarget.style.color = 'var(--color-accent-teal)'
            }}
          >
            <ArrowRight size={18} className="rotate-180" />
          </button>
          <button
            onClick={() => scrollTo(Math.min(publications.length - 1, activeIndex + 1))}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 items-center justify-center rounded-full transition-all duration-300"
            style={{
              border: '1px solid rgba(45, 212, 168, 0.3)',
              color: 'var(--color-accent-teal)',
              backgroundColor: 'rgba(6, 11, 20, 0.8)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-teal)'
              e.currentTarget.style.color = '#060B14'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(6, 11, 20, 0.8)'
              e.currentTarget.style.color = 'var(--color-accent-teal)'
            }}
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {publications.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === activeIndex ? 'var(--color-accent-teal)' : 'transparent',
                border: i === activeIndex ? 'none' : '1px solid rgba(56, 189, 166, 0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── Section 6: News & Awards ───────── */
const newsItems = [
  {
    date: 'Aug 2026',
    title: 'ISME20 Presentation',
    detail: 'Lab members presented at the 20th International Symposium on Microbial Ecology in Auckland, New Zealand',
  },
  {
    date: 'Jan 2025',
    title: 'Joseph Lister Award Finalist',
    detail: 'Dr. Shi Huang named finalist at IADR 2025, Barcelona',
  },
  {
    date: 'Nov 2024',
    title: 'Outstanding Poster Award',
    detail: 'Yufeng Zhang wins at Chinese Association of Microbial Ecology, Qingdao',
  },
  {
    date: 'Jun 2024',
    title: 'HKU TEC MedTech Hackathon Finalist',
    detail: 'ProbioMine Biotech project recognized',
  },
  {
    date: 'Jun 2024',
    title: 'Best Poster Award',
    detail: '2nd Frontiers Forum on Next-Generation Biomaterials in Dental Medicine, HK',
  },
]

function NewsSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={ref} className="section-padding" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionLabel text="// Updates" />
          <h2
            className="font-display font-medium leading-[1.2]"
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
              letterSpacing: '-0.01em',
              color: 'var(--color-text-primary)',
            }}
          >
            Latest News
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
          {/* News timeline */}
          <div className="flex flex-col gap-0">
            {newsItems.map((item, i) => (
              <div
                key={i}
                className={`flex gap-4 py-4 px-3 rounded-lg transition-all duration-500 cursor-default ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{
                  borderBottom: '1px solid rgba(56, 189, 166, 0.06)',
                  transitionDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 212, 168, 0.03)'
                  e.currentTarget.style.borderLeft = '2px solid var(--color-accent-teal)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderLeft = '2px solid transparent'
                }}
              >
                <span
                  className="font-mono text-[0.8rem] font-medium shrink-0 w-[80px] sm:w-[100px]"
                  style={{ color: 'var(--color-accent-cyan)' }}
                >
                  {item.date}
                </span>
                <div>
                  <p className="text-[0.9rem] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {item.title}
                  </p>
                  <p className="text-[0.8rem] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Highlight card */}
          <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="glass-card p-8 lg:p-10 h-full flex flex-col items-center text-center">
              <span
                className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-4"
                style={{ color: 'var(--color-accent-gold)' }}
              >
                Featured Achievement
              </span>
              <Trophy size={48} className="mb-4" style={{ color: 'var(--color-accent-gold)' }} />
              <h3
                className="font-display font-medium text-[1.5rem] leading-[1.3] mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                IADR 2025 Joseph Lister Award Finalist
              </h3>
              <p className="text-[0.875rem] leading-[1.6] mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                Dr. Shi Huang has been selected as a finalist for the prestigious Joseph Lister Award for New Investigators at IADR 2025 in Barcelona, Spain.
              </p>
              <Link
                to="/awards"
                className="inline-flex items-center gap-2 text-[0.875rem] font-medium mt-auto"
                style={{ color: 'var(--color-accent-teal)' }}
              >
                View All Awards
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── Section 7: Facilities Preview ───────── */
const facilities = [
  {
    image: '/facility-flowracs.png',
    name: 'FlowRACS',
    tagline: 'High-throughput Raman-activated Flow Cytometer',
  },
  {
    image: '/facility-rams.png',
    name: 'RAMS',
    tagline: 'Raman-Activated Microfluidic Sorter',
  },
  {
    image: '/facility-easysort.png',
    name: 'EasySort Compact',
    tagline: 'Single-cell Microdroplet Sorting System',
  },
  {
    image: '/facility-dcp.png',
    name: 'DCP',
    tagline: 'Digital Colony Picker',
  },
]

function FacilitiesSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={ref} className="section-padding" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionLabel text="// Facilities" />
          <h2
            className={`font-display leading-[1.15] transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
            }}
          >
            Raman Single-Cell Facilities
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac, i) => (
            <Link
              key={fac.name}
              to="/facilities"
              className={`group glass-card overflow-hidden transition-all duration-600 glass-card-hover ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="overflow-hidden aspect-[4/3]">
                <img
                  src={fac.image}
                  alt={fac.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-[1.125rem] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  {fac.name}
                </h3>
                <p className="text-[0.875rem]" style={{ color: 'var(--color-text-secondary)' }}>
                  {fac.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/facilities"
            className="inline-flex items-center gap-2 text-[0.875rem] font-medium transition-all duration-300"
            style={{ color: 'var(--color-accent-teal)' }}
          >
            View All Facilities
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ───────── Section 8: Contact CTA ───────── */
function ContactCTASection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.3 })

  return (
    <section ref={ref} className="section-padding" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="mx-auto max-w-[640px] px-4 sm:px-6 text-center">
        <h2
          className={`font-display leading-[1.15] gradient-text-teal transition-all duration-800 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            letterSpacing: '-0.02em',
          }}
        >
          Join Our Research Journey
        </h2>
        <p
          className={`text-[1.125rem] leading-[1.7] mt-4 transition-all duration-700 delay-150 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Whether you&apos;re a prospective student, collaborator, or fellow researcher, we&apos;d love to hear from you.
        </p>
        <div className={`mt-8 transition-all duration-600 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Link
            to="/contact"
            className="inline-block px-8 py-3.5 rounded-full text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300 hover:scale-[1.04] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #2DD4A8 0%, #22D3EE 100%)',
              color: '#060B14',
              boxShadow: '0 0 30px rgba(45, 212, 168, 0.3)',
            }}
          >
            Get in Touch
          </Link>
        </div>
        <div className={`mt-6 space-y-1 transition-all duration-600 delay-400 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <a
            href="mailto:shihuang@hku.hk"
            className="block text-[0.875rem] transition-colors duration-200"
            style={{ color: 'var(--color-accent-teal)' }}
          >
            shihuang@hku.hk
          </a>
          <p className="text-[0.75rem]" style={{ color: 'var(--color-text-muted)' }}>
            Room 2A10, Prince Philip Dental Hospital, HKU
          </p>
        </div>
      </div>
    </section>
  )
}

/* ───────── Home Page ───────── */
export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <AboutPISection />
      <ResearchSection />
      <PublicationsSection />
      <NewsSection />
      <FacilitiesSection />
      <ContactCTASection />
    </div>
  )
}
