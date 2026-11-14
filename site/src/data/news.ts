export interface NewsItem {
  id: number
  date: string
  year: number
  category: 'Publication' | 'Grant' | 'Patent' | 'Collaboration' | 'Award' | 'Event'
  title: string
  summary: string
  link?: string
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    date: '2026-05-01',
    year: 2026,
    category: 'Publication',
    title: 'New Paper in Microbiome',
    summary:
      'Our latest study "Capsaicin ameliorates glycemic levels via gut microbiota-derived 5-aminolevulinic acid in mice" has been published in Microbiome. This work reveals a novel mechanism by which dietary capsaicin interacts with gut microbiota to improve glycemic control.',
    link: 'https://pubmed.ncbi.nlm.nih.gov/42067917/',
  },
  {
    id: 2,
    date: '2026-04-10',
    year: 2026,
    category: 'Publication',
    title: 'Editorial on Extra-intestinal Microbiome',
    summary:
      'Dr. Huang Shi and Dr. Xu Xin published an Editorial "Perspectives in extra-intestinal microbiome 2025" in Frontiers in Cellular and Infection Microbiology, discussing emerging research directions in extra-intestinal microbiome studies.',
    link: 'https://www.frontiersin.org/journals/cellular-and-infection-microbiology/articles/10.3389/fcimb.2026.1824939/abstract',
  },
  {
    id: 3,
    date: '2025-12-15',
    year: 2025,
    category: 'Collaboration',
    title: 'Collaboration with Engineering Faculty Established',
    summary:
      'Our lab established a new interdisciplinary collaboration with the Faculty of Engineering at HKU to develop AI-driven microbiome analysis platforms combining deep learning and single-cell Raman spectroscopy.',
  },
  {
    id: 4,
    date: '2026-07-04',
    year: 2026,
    category: 'Grant',
    title: "Hong Kong RGC's GRF (01/01/2027-31/12/2030) awarded. PI: Dr. Shi HUANG.",
    summary:
      'AI-Powered De Novo Discovery and Functional Validation of Anti-Gingivitis Metabolites.',
    link: 'https://www.ugc.edu.hk/eng/rgc/funding_opport/grf/funded_research.html',
  },
]

export const categoryColors: Record<string, string> = {
  Publication: '#2DD4A8',
  Grant: '#F59E0B',
  Patent: '#EF4444',
  Collaboration: '#3B82F6',
  Award: '#8B5CF6',
  Event: '#EC4899',
}

export const categoryLabels: Record<string, string> = {
  Publication: '📄 Publication',
  Grant: '💰 Grant',
  Patent: '🔬 Patent',
  Collaboration: '🤝 Collaboration',
  Award: '🏆 Award',
  Event: '📅 Event',
}
