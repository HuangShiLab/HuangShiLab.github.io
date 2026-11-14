import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  Scan,
  Microscope,
  Zap,
  Brain,
  CheckCircle,
  ArrowRight,
  ExternalLink,
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
      {/* teal gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(45,212,168,0.10) 0%, transparent 60%)',
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
          // Facilities
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
          Our Facilities
        </motion.h1>

        <motion.p
          className="mx-auto max-w-[640px]"
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.35 }}
        >
          Advanced single-cell analysis and sorting instrumentation powered by
          Raman spectroscopy
        </motion.p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Section 2 — Technology Overview
   ═══════════════════════════════════════════════════════════ */

interface StatItemData {
  icon: React.ReactNode
  label: string
}

const statItems: StatItemData[] = [
  {
    icon: <Scan size={28} style={{ color: 'var(--color-accent-teal)' }} />,
    label: 'Label-Free',
  },
  {
    icon: <Microscope size={28} style={{ color: 'var(--color-accent-teal)' }} />,
    label: 'Single-Cell Resolution',
  },
  {
    icon: <Zap size={28} style={{ color: 'var(--color-accent-teal)' }} />,
    label: 'High Throughput',
  },
  {
    icon: <Brain size={28} style={{ color: 'var(--color-accent-teal)' }} />,
    label: 'AI-Powered',
  },
]

function TechnologyOverviewSection() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Stat highlights row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.6,
                ease: easeOutExpo,
                delay: index * 0.1,
              }}
            >
              <div
                className="flex items-center justify-center mb-3"
                style={{
                  width: 56,
                  height: 56,
                  border: '1px solid rgba(45, 212, 168, 0.2)',
                  borderRadius: 14,
                }}
              >
                {item.icon}
              </div>
              <span
                className="font-body text-[0.875rem] font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Description paragraph */}
        <motion.p
          className="mx-auto max-w-[720px] text-center"
          style={{
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            fontSize: '1rem',
          }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.2 }}
        >
          Our suite of Raman-based single-cell technologies enables
          culture-free, label-free profiling of individual cells with
          unprecedented throughput and precision. From high-throughput cell
          sorting to intelligent microdroplet encapsulation and digital colony
          picking, these platforms provide end-to-end solutions for metabolic
          phenotyping, functional mining of cells and enzymes, and single-cell
          multi-omics research.
        </motion.p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Section 3 — Instruments
   ═══════════════════════════════════════════════════════════ */

interface InstrumentData {
  name: string
  fullName: string
  image: string
  keyFeatures: string[]
  description: string
}

const instruments: InstrumentData[] = [
  {
    name: 'FlowRACS',
    fullName: 'FlowRACS \u2014 High-throughput Raman-activated Flow Cytometer',
    image: '/facility-flowracs.png',
    keyFeatures: [
      'Analysis of live cells without labeling',
      'High-throughput, fully automated single-cell analysis and sorting',
      'High-quality Single-cell Raman Spectra (SCRS) acquisition',
      'Minimal impact on biological activity of sorted cells',
      'Throughput up to 2,000 cells/min',
    ],
    description:
      'FlowRACS\u00AE is a high-throughput flow cytometer featuring metabolic phenotype-based cell characterization and sorting with single-cell Raman spectroscopy. Inside FlowRACS\u00AE, cells are analyzed and sorted without labeling or staining. Using patented technology, cells are aligned and passed sequentially through a checkpoint, where Raman spectrum of each cell is accurately determined. Live cells with targeted Raman spectra or metabolic functions can then be collected for desired downstream analysis. Single-cell Raman spectra obtained in FlowRACS\u00AE experiments can simultaneously reveal cellular identity and functions including catabolism, anabolism, metabolite-interaction network, stress/drug response, and species interaction. FlowRACS\u00AE employs an on-the-fly full Raman spectrum analysis algorithm that interprets and analyzes Raman spectrum in real-time as they are being collected for increased throughput and full automation. The instrument represents the next-generation solution for rapid and low-cost metabolic phenotype profiling, function-based mining of cells and enzymes from nature, and dissection of functional mechanisms of complex biological systems, all at single-cell resolution.',
  },
  {
    name: 'RAMS',
    fullName: 'RAMS \u2014 Raman-Activated Microfluidic Sorter',
    image: '/facility-rams.png',
    keyFeatures: [
      'Multi-modal measurements: Raman, brightfield, fluorescence',
      'Automated continuous sample reloading',
      'Precise single-cell sorting into 96-well plates',
      'Intelligent, end-to-end automated workflow',
    ],
    description:
      'RAMS\u00AE integrates Raman spectroscopy, cell imaging, and precision microfluidics into a single platform for high-content single-cell analysis and sorting. Using multi-modal "Raman + imaging + fluorescence" measurements, RAMS\u00AE captures each cell\'s metabolic fingerprints and morphological features with simplified sample preparation. Enabled by precision microfluidic cell manipulation, the system performs high-efficiency cell capture sorting, with sorted cells seamlessly coupled to downstream single-cell cultivation or multiomic workflows.',
  },
  {
    name: 'EasySort Compact',
    fullName: 'EasySort Compact \u2014 Single-cell Microdroplet Sorting System',
    image: '/facility-easysort.png',
    keyFeatures: [
      'Precise cell acquisition within the microscopic field: AI-enabled targeting and sorting of specific cells',
      'Fully visualized cell sorting process',
      'Non-destructive sorting and collection of single cells',
      'Intelligent obstacle avoidance',
    ],
    description:
      'EasySort Compact is a standalone instrument equipped with an integrated brightfield / fluorescent microscope for cell visualization and sorting. It features precise cell sorting, reliable encapsulation of target cells into microdroplets, and minimal impact on biological activity of sorted cells. EasySort Compact provides a simple and complete solution for single-cell sorting into 96-well microtiter plate. EasySort Compact controls the movement trajectory of single cells via optical tweezers, and encapsulates each target cell into a microdroplet, enabling downstream single-cell sequencing or cultivation. EasySort Compact is compatible with a wide range of cells, including bacterial, archaeal, fungal, plant, animal, and human cells.',
  },
  {
    name: 'DCP',
    fullName: 'DCP \u2014 Digital Colony Picker',
    image: '/facility-dcp.png',
    keyFeatures: [
      'Highly parallelized microfluidic device for microbial and mammalian cell culture',
      'Cell cultivation in a microfluidic chip containing 16,000 physically isolated, picoliter-scale microchambers',
      'Growth and functional phenotype monitoring via brightfield and fluorescence imaging',
      'AI-powered strain de-duplication',
      'Precise, contact-free clone recovery using laser-induced bubble (LIB) technology',
      'Fully automated workflow for clone selection and recovery',
    ],
    description:
      'Digital Colony Picker (DCP) is a microfluidic device engineered for large-scale, parallel cultivation of single cells followed by automated selection and retrieval of functional clones. It features cultivation in an aqueous environment within each of the 16,000 physically isolated microchambers, real-time phenotypic monitoring during cell growth, and fully automated, AI-powered selection and recovery of clones exhibiting desired growth and functional phenotypes. Compatible with both microbial and mammalian cells, DCP is ideal for applications including strain and cell line development, environmental microbial resource mining, and microbiome research.',
  },
]

function InstrumentCard({
  instrument,
  index,
}: {
  instrument: InstrumentData
  index: number
}) {
  const isEven = index % 2 === 0
  const imageContent = (
    <motion.div
      className="overflow-hidden flex-shrink-0"
      style={{ borderRadius: '16px' }}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.6,
        ease: easeOutExpo,
        delay: 0.1,
      }}
    >
      <img
        src={instrument.image}
        alt={instrument.name}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.04]"
        style={{ aspectRatio: '4/3', maxHeight: 360 }}
        loading="lazy"
      />
    </motion.div>
  )

  const textContent = (
    <motion.div
      className="flex flex-col justify-center"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        ease: easeOutExpo,
        delay: 0.2,
      }}
    >
      <h3
        className="font-display mb-2"
        style={{
          fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          color: 'var(--color-text-primary)',
        }}
      >
        {instrument.fullName}
      </h3>

      {/* Key Features */}
      <div className="flex flex-col gap-2 mb-4 mt-3">
        {instrument.keyFeatures.map((feature) => (
          <div key={feature} className="flex items-start gap-2.5">
            <CheckCircle
              size={15}
              className="mt-0.5 shrink-0"
              style={{ color: 'var(--color-accent-teal)' }}
            />
            <span
              className="font-body text-[0.875rem]"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Full Description */}
      <p
        className="font-body text-[0.875rem] mb-5"
        style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
      >
        {instrument.description}
      </p>

      {/* eCyte reference link */}
      <a
        href="https://ecytebio.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium transition-colors duration-200"
        style={{ color: 'var(--color-accent-teal)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-accent-cyan)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-accent-teal)'
        }}
      >
        Learn more at ecytebio.com
        <ExternalLink size={13} />
      </a>
    </motion.div>
  )

  return (
    <motion.div
      className="group"
      style={{
        background: 'rgba(10, 21, 37, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(56, 189, 166, 0.12)',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
      }}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.6,
        ease: easeOutExpo,
        delay: index * 0.1,
      }}
      whileHover={{
        y: -4,
        borderColor: 'rgba(56, 189, 166, 0.30)',
        boxShadow: '0 8px 40px rgba(45, 212, 168, 0.06)',
      }}
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
          isEven ? '' : 'lg:direction-rtl'
        }`}
        style={isEven ? {} : { direction: 'rtl' }}
      >
        <div style={isEven ? {} : { direction: 'ltr' }}>
          {isEven ? imageContent : textContent}
        </div>
        <div style={isEven ? {} : { direction: 'ltr' }}>
          {isEven ? textContent : imageContent}
        </div>
      </div>
    </motion.div>
  )
}

function InstrumentsSection() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-[680px] text-center mb-16">
          <motion.p
            className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-4"
            style={{ color: 'var(--color-accent-teal)' }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            // Instruments
          </motion.p>
          <motion.h2
            className="font-display mb-4"
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
            Our Instrumentation
          </motion.h2>
          <motion.p
            style={{
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
            }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.15 }}
          >
            Four advanced platforms covering the full spectrum of single-cell
            Raman analysis, sorting, and cultivation
          </motion.p>
        </div>

        {/* Instrument cards */}
        <div className="flex flex-col gap-10">
          {instruments.map((instrument, index) => (
            <InstrumentCard
              key={instrument.name}
              instrument={instrument}
              index={index}
            />
          ))}
        </div>

        {/* RASCF Platform Banner */}
        <motion.div
          className="mt-10"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 21, 37, 0.9) 0%, rgba(14, 29, 51, 0.95) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 166, 0.2)',
            borderRadius: '16px',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.1 }}
          whileHover={{
            borderColor: 'rgba(56, 189, 166, 0.35)',
            boxShadow: '0 8px 40px rgba(45, 212, 168, 0.08)',
          }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-1">
              <div
                className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-2"
                style={{ color: 'var(--color-accent-teal)' }}
              >
                // Facility Platform
              </div>
              <h3
                className="font-display mb-2"
                style={{
                  fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  color: 'var(--color-text-primary)',
                }}
              >
                RASCF — Raman-activated Single-cell Facility
              </h3>
              <p
                className="font-body text-[0.875rem]"
                style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
              >
                Visit our dedicated platform website for detailed facility
                introductions, usage guidelines, and online reservation
                for all Raman single-cell instruments.
              </p>
            </div>
            <a
              href="https://huangshilab.github.io/hku-rascf-website/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300"
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
              Visit RASCF Platform
              <ExternalLink size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Section 4 — Access Log
   ═══════════════════════════════════════════════════════════ */

interface LogEntryData {
  date: string
  group: string
  equipment: string
}

const accessLog: LogEntryData[] = [
  {
    date: '2025/01/08 \u2013 2025/01/21',
    group: "Prof. Tsoi James Kit Hon's HKU Faculty of Dentistry group",
    equipment: 'FlowRACS',
  },
  {
    date: '2024/12/13',
    group: "Prof. Ye Zhou's HKU Faculty of Dentistry group",
    equipment: 'FlowRACS',
  },
  {
    date: '2024/11/23',
    group: "Prof. Wang Kailiang's group from HKBU",
    equipment: 'FlowRACS',
  },
  {
    date: '2024/11/04',
    group: 'Qingdao West Coast New Area government delegation (Liu Luying)',
    equipment: 'Raman facilities',
  },
  {
    date: '2024/09/04',
    group: "Prof. Ye Zhou's HKU Faculty of Dentistry group",
    equipment: 'RAMS',
  },
  {
    date: '2024/08/23',
    group: "Prof. Liu Fang's HKU Faculty of Medicine team",
    equipment: 'FlowRACS',
  },
  {
    date: '2024/08/16',
    group: "Prof. Tsoi James Kit Hon's HKU Faculty of Dentistry group",
    equipment: 'RAMS',
  },
  {
    date: '2024/04/23',
    group: 'Qingdao government delegation led by Wang Bo, Vice Mayor',
    equipment: 'Raman facilities',
  },
]

function LogEntry({
  entry,
  index,
  isLast,
}: {
  entry: LogEntryData
  index: number
  isLast: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: '16px 0' }}
    >
      {/* Timeline line */}
      {!isLast && (
        <div
          className="absolute left-[12px] sm:left-[168px] top-[44px] bottom-0 w-px"
          style={{
            backgroundColor: 'rgba(56, 189, 166, 0.15)',
          }}
        />
      )}

      {/* Date */}
      <div className="flex items-start gap-3">
        {/* Dot */}
        <div
          className="relative z-10 mt-1.5 shrink-0 rounded-full"
          style={{
            width: 8,
            height: 8,
            backgroundColor: hovered
              ? 'var(--color-accent-teal)'
              : 'rgba(56, 189, 166, 0.4)',
            boxShadow: hovered
              ? '0 0 10px rgba(45, 212, 168, 0.5)'
              : 'none',
            transition: 'all 0.3s ease',
          }}
        />
        <span
          className="font-body text-[0.8rem] font-medium"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {entry.date}
        </span>
      </div>

      {/* Content */}
      <div>
        <p
          className="font-body text-[0.875rem]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {entry.group}
        </p>
        <p
          className="font-body text-[0.8rem] mt-0.5"
          style={{ color: 'var(--color-accent-teal)' }}
        >
          {entry.equipment}
        </p>
      </div>
    </motion.div>
  )
}

function AccessLogSection() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <motion.p
            className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-4"
            style={{ color: 'var(--color-accent-teal)' }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            // Access Log
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
            Access Log
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {accessLog.map((entry, index) => (
            <LogEntry
              key={index}
              entry={entry}
              index={index}
              isLast={index === accessLog.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Section 5 — Contact CTA
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="mx-auto max-w-[640px] px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="font-display mb-4"
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
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          Interested in Using Our Facilities?
        </motion.h2>

        <motion.p
          className="mb-8"
          style={{
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
          }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.1 }}
        >
          External researchers and collaborators are welcome to access our
          Raman single-cell facilities. Contact us to discuss your project
          requirements and explore collaboration opportunities.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.2 }}
        >
          {/* Primary button — Contact Us */}
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300"
            style={{
              background:
                'linear-gradient(135deg, #2DD4A8 0%, #22D3EE 100%)',
              color: '#060B14',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)'
              e.currentTarget.style.boxShadow =
                '0 0 30px rgba(45, 212, 168, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Contact Us
            <ArrowRight size={16} />
          </Link>

          {/* Outline button — View Our Team */}
          <Link
            to="/team"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[0.875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300"
            style={{
              border: '1px solid rgba(56, 189, 166, 0.3)',
              color: 'var(--color-accent-teal)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 166, 0.6)'
              e.currentTarget.style.color = 'var(--color-accent-cyan)'
              e.currentTarget.style.backgroundColor =
                'rgba(45, 212, 168, 0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 166, 0.3)'
              e.currentTarget.style.color = 'var(--color-accent-teal)'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            View Our Team
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════════════ */
export default function Facilities() {
  return (
    <main>
      <HeroSection />
      <TechnologyOverviewSection />
      <InstrumentsSection />
      <AccessLogSection />
      <CTASection />
    </main>
  )
}
