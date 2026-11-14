import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Filter, ExternalLink } from 'lucide-react'
import { newsItems, categoryColors, categoryLabels } from '@/data/news'

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const categories = ['All', ...Array.from(new Set(newsItems.map((n) => n.category)))]

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? newsItems
      : newsItems.filter((n) => n.category === activeCategory)

  return (
    <main
      className="w-full"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          minHeight: 'clamp(35vh, 45vh, 55vh)',
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(14, 29, 51, 0.8) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 70% 60%, rgba(45, 212, 168, 0.06) 0%, transparent 60%)',
        }}
      >
        <div className="max-w-[800px] mx-auto px-6 pt-32 pb-16">
          <motion.span
            className="inline-block text-[0.75rem] font-semibold uppercase tracking-[0.08em] mb-4"
            style={{ color: 'var(--color-accent-teal)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            // Updates
          </motion.span>
          <motion.h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              background:
                'linear-gradient(135deg, #F0F4F8 0%, #2DD4A8 50%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 }}
          >
            Lab News
          </motion.h1>
          <motion.p
            className="font-body mt-4"
            style={{
              fontSize: 'clamp(0.875rem, 1.1vw, 1rem)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              maxWidth: '540px',
              margin: '1rem auto 0',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.25 }}
          >
            Latest updates on publications, grants, collaborations, and
            achievements from our lab
          </motion.p>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <section className="max-w-[960px] mx-auto px-6 pt-12 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Filter
            size={16}
            style={{ color: 'var(--color-text-muted)' }}
          />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-[0.8rem] font-medium transition-all duration-300"
              style={{
                backgroundColor:
                  activeCategory === cat
                    ? 'rgba(45, 212, 168, 0.15)'
                    : 'transparent',
                color:
                  activeCategory === cat
                    ? 'var(--color-accent-teal)'
                    : 'var(--color-text-secondary)',
                border:
                  activeCategory === cat
                    ? '1px solid rgba(45, 212, 168, 0.3)'
                    : '1px solid rgba(148, 163, 184, 0.15)',
              }}
            >
              {cat === 'All' ? 'All' : categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── News Timeline ── */}
      <section className="max-w-[960px] mx-auto px-6 pb-24">
        <div className="relative">
          {/* Central timeline line */}
          <div
            className="absolute left-[7px] top-0 bottom-0 w-[2px] hidden md:block"
            style={{
              background:
                'linear-gradient(180deg, var(--color-accent-teal) 0%, rgba(45,212,168,0.1) 100%)',
            }}
          />

          <div className="flex flex-col gap-8">
            {filtered.map((news, index) => (
              <motion.article
                key={news.id}
                className="relative flex gap-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.6,
                  ease: easeOutExpo,
                  delay: index * 0.08,
                }}
              >
                {/* Timeline dot */}
                <div className="hidden md:flex flex-col items-center pt-6">
                  <div
                    className="w-[16px] h-[16px] rounded-full shrink-0"
                    style={{
                      backgroundColor: categoryColors[news.category] || '#2DD4A8',
                      boxShadow: `0 0 12px ${categoryColors[news.category] || '#2DD4A8'}40`,
                    }}
                  />
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded-2xl p-6 transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(10, 21, 37, 0.72)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(56, 189, 166, 0.12)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      'rgba(56, 189, 166, 0.3)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      'rgba(56, 189, 166, 0.12)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* Header row */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${categoryColors[news.category]}15`,
                        color: categoryColors[news.category],
                        border: `1px solid ${categoryColors[news.category]}30`,
                      }}
                    >
                      {categoryLabels[news.category] || news.category}
                    </span>
                    <span
                      className="flex items-center gap-1 text-[0.8rem]"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <Calendar size={13} />
                      {news.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display mb-2"
                    style={{
                      fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)',
                      fontWeight: 500,
                      lineHeight: 1.3,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {news.title}
                  </h3>

                  {/* Summary */}
                  <p
                    className="font-body text-[0.85rem]"
                    style={{
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.7,
                    }}
                  >
                    {news.summary}
                  </p>

                  {/* Link */}
                  {news.link && (
                    <a
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-[0.8rem] font-medium transition-colors duration-200"
                      style={{ color: 'var(--color-accent-teal)' }}
                    >
                      Read more <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div
            className="text-center py-20"
            style={{ color: 'var(--color-text-muted)' }}
          >
            No news items in this category yet.
          </div>
        )}
      </section>

      {/* ── Stats CTA ── */}
      <section className="max-w-[800px] mx-auto px-6 pb-24 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <p
            className="font-body mb-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Stay updated with our latest research breakthroughs and lab
            milestones
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[0.8rem] font-semibold uppercase tracking-wider transition-all duration-300"
              style={{
                background:
                  'linear-gradient(135deg, #2DD4A8 0%, #22D3EE 100%)',
                color: '#060B14',
              }}
            >
              View Publications <ArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[0.8rem] font-semibold uppercase tracking-wider transition-all duration-300"
              style={{
                border: '1px solid rgba(45, 212, 168, 0.3)',
                color: 'var(--color-accent-teal)',
              }}
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
