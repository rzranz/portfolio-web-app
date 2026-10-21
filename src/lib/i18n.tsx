import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Language = 'en' | 'id'

interface Translations {
  [key: string]: {
    en: string
    id: string
  }
}

export const translations: Translations = {
  // Navbar & Staggered Menu
  'nav.menu': { en: 'Menu', id: 'Menu' },
  'nav.close': { en: 'Close', id: 'Tutup' },
  'nav.contact': { en: 'Contact', id: 'Kontak' },
  'nav.status': { en: 'Available for Hire', id: 'Tersedia untuk Rekrutmen' },
  'menu.home': { en: 'Home', id: 'Beranda' },
  'menu.about': { en: 'About', id: 'Tentang' },
  'menu.experience': { en: 'Experience', id: 'Organisasi' },
  'menu.works': { en: 'Works', id: 'Karya' },
  'menu.contact': { en: 'Contact', id: 'Kontak' },
  'menu.cv': { en: 'DOWNLOAD CV (ATS)', id: 'DOWNLOAD CV (ATS)' },
  'menu.light': { en: 'LIGHT', id: 'LIGHT' },
  'menu.dark': { en: 'DARK', id: 'DARK' },
  'menu.system': { en: 'SYSTEM', id: 'SYSTEM' },
  
  // Hero
  'hero.status': { en: 'AVAILABLE FOR NEW ROLES', id: 'TERSEDIA UNTUK ROLE BARU' },
  'hero.location': { en: 'BANDUNG, ID (UTC+7)', id: 'BANDUNG, ID (WIB)' },
  'hero.label': { en: 'FULLSTACK SOFTWARE ENGINEER —', id: 'TEKNISI PERANGKAT LUNAK FULLSTACK —' },
  'hero.iam': { en: 'I AM', id: 'SAYA' },
  'hero.desc': { en: 'Driven by logic, adaptability, and the pursuit of clean code.', id: 'Didorong oleh logika, kemampuan beradaptasi, dan dedikasi pada kode yang bersih.' },
  'hero.about': { en: 'ABOUT', id: 'TENTANG' },
  'hero.recent': { en: 'RECENT WORK', id: 'KARYA TERBARU' },

  // About
  'about.title': { en: 'RANDI ZAKARIA PUTRA', id: 'RANDI ZAKARIA PUTRA' },
  'about.uni': { en: 'Universitas Komputer Indonesia (2022-2026)', id: 'Universitas Komputer Indonesia (2022-2026)' },
  'about.degree': { en: 'Bachelor of Informatics Engineering (GPA: 3.43)', id: 'S1 Teknik Informatika (IPK: 3.43)' },
  'about.p1': { 
    en: 'I am a Fullstack Software Engineer with a proven track record of building scalable web applications. My expertise lies in architecting robust backend systems and creating responsive, intuitive frontends.', 
    id: 'Saya adalah seorang Fullstack Software Engineer dengan rekam jejak yang terbukti dalam membangun aplikasi web yang skalabel. Keahlian saya terletak pada perancangan sistem backend yang kuat dan pembuatan frontend yang responsif dan intuitif.' 
  },
  'about.p2': { 
    en: 'With hands-on experience in managing technical projects and leading teams, I approach every challenge with strong problem-solving skills and technical adaptability—whether I\'m integrating payment gateways, developing REST APIs, or building enterprise systems.', 
    id: 'Dengan pengalaman langsung dalam mengelola proyek teknis dan memimpin tim, saya mendekati setiap tantangan dengan kemampuan pemecahan masalah yang kuat dan kemampuan adaptasi teknis—baik saat saya mengintegrasikan gateway pembayaran, mengembangkan REST API, atau membangun sistem perusahaan.' 
  },
  'about.stats.title': { en: 'Key Engineering Metrics', id: 'Metrik Kunci Rekayasa' },

  // Tech Stack
  'tech.title': { en: 'Technologies I work with', id: 'Teknologi yang saya gunakan' },
  'tech.subtitle': { en: 'Modular architectures across frontend, backend, cloud, and 3D/AI systems.', id: 'Arsitektur modular di seluruh sistem frontend, backend, cloud, dan 3D/AI.' },

  // Recent Works (02)
  'works.kicker': { en: '02 / PORTFOLIO', id: '02 / PORTOFOLIO' },
  'works.title': { en: 'Selected Works.', id: 'Karya Pilihan.' },
  'works.filterLabel': { en: 'Filter:', id: 'Filter:' },
  'works.viewDetail': { en: 'View Detail', id: 'Lihat Detail' },
  'works.featured': { en: 'Featured Projects & Case Studies', id: 'Proyek Unggulan & Studi Kasus' },
  'works.view': { en: 'View Project', id: 'Lihat Proyek' },
  'works.casestudy': { en: 'Case Study', id: 'Studi Kasus' },
  'works.livedemo': { en: 'Live Platform', id: 'Platform Live' },
  'works.source': { en: 'GitHub Repo', id: 'Repo GitHub' },
  'works.modalClose': { en: 'Close', id: 'Tutup' },
  'works.keyHighlights': { en: 'Key Architecture & Highlights', id: 'Arsitektur & Sorotan Utama' },
  'works.filterAll': { en: 'All Categories', id: 'Semua Kategori' },
  'works.title1': { en: 'Portfolio & Selected', id: 'Portofolio & Karya' },
  'works.title2': { en: 'Works', id: 'Pilihan' },
  'works.desc': { 
    en: "Explore production web apps, gamified edtech platforms, and backend services. Click any project to open detailed architectural breakdowns.", 
    id: 'Jelajahi aplikasi web skala produksi, platform edtech gamifikasi, dan layanan backend. Klik proyek untuk membuka rincian arsitektur lengkap.' 
  },
  'works.contact': { en: "get in touch", id: "menghubungi saya" },
  'works.share': { en: "— I'd be happy to share.", id: "— saya akan dengan senang hati membagikannya." },
  'works.scroll': { en: 'Scroll to Explore', id: 'Gulir untuk Eksplorasi' },
  'works.built': { en: 'Built with: ', id: 'Dibangun dengan: ' },
  'works.code': { en: 'View case study', id: 'Buka studi kasus' },
  'works.mobileTitle': { en: 'Selected Projects', id: 'Proyek Pilihan' },
  'works.mobileSub': { en: 'Filter and tap cards to inspect architecture.', id: 'Filter dan ketuk kartu untuk memeriksa arsitektur.' },

  // Experience Scroll Review (03)
  'experience.kicker': { en: '03 / EXPERIENCE', id: '03 / PENGALAMAN' },
  'experience.title': { en: 'Career Journey.', id: 'Jejak Perjalanan.' },
  'experience.subtitle': { 
    en: 'Step-by-step review across organizational leadership, industry internship, public sector systems, and software house engineering.', 
    id: 'Tinjauan bertahap mulai dari kepemimpinan organisasi, magang industri, proyek pemerintahan & BUMD, hingga software house aktif saat ini.' 
  },
  'experience.hint': { en: 'Scroll down to review milestones', id: 'Gulir untuk meninjau pengalaman' },
  'experience.step': { en: 'MILESTONE', id: 'TAHAP' },

  // 6 Separated Milestones
  'exp.cat.org': { en: 'Student Leadership', id: 'Kepemimpinan Organisasi' },
  'exp.desc.org': { 
    en: 'Led the Communication & Information division at HMIF UNIKOM. Directed official web portal revitalization, media channels, and 10+ members.', 
    id: 'Memimpin divisi Komunikasi dan Informasi di HMIF UNIKOM. Mengorkestrasi revitalisasi portal web resmi, media publikasi, dan divisi 10+ orang.' 
  },

  'exp.cat.intern': { en: 'Industry Internship', id: 'Magang Industri' },
  'exp.desc.intern': { 
    en: 'Dual role as Project Manager and Fullstack Developer. Managed sprint schedules, technical backlogs, and relational database schemas.', 
    id: 'Mengemban peran ganda sebagai Project Manager & Fullstack Dev. Mengawal jadwal sprint, backlog teknis, dan arsitektur database relasional.' 
  },

  'exp.cat.dishut': { en: 'Government Project', id: 'Proyek Pemerintahan' },
  'exp.desc.dishut': { 
    en: 'Architected SIGAP JABAR for West Java Forestry Department (Dinas Kehutanan). WebGIS priority mapping & critical land rehabilitation monitoring.', 
    id: 'Merancang SIGAP JABAR untuk Dinas Kehutanan Jawa Barat. Pemetaan prioritas WebGIS & monitoring rehabilitasi lahan kritis.' 
  },

  'exp.cat.pdam': { en: 'Municipal Utility IoT', id: 'Proyek IoT BUMD' },
  'exp.desc.pdam': { 
    en: 'Engineered real-time telemetry ingestion pipelines and operational dashboards for IoT water quality sensors at PDAM Kota Tegal.', 
    id: 'Membangun pipeline penyerapan data telemetri real-time dan dashboard operasional sensor kualitas air IoT di PDAM Kota Tegal.' 
  },

  'exp.cat.darulfikri': { en: 'Educational Client', id: 'Klien Pendidikan' },
  'exp.desc.darulfikri': { 
    en: 'Integrated automated Pakasir payment gateway for student tuition (SPP) and real-time WhatsApp parent notification bots for RA Darul Fikri.', 
    id: 'Mengintegrasikan gateway pembayaran Pakasir otomatis untuk SPP dan bot notifikasi WhatsApp real-time kepada wali murid RA Darul Fikri.' 
  },

  'exp.cat.sh': { en: 'Software House (Active)', id: 'Software House (Aktif)' },
  'exp.desc.sh': { 
    en: 'Developing production enterprise web systems, gamified AI learning engines, and responsive digital products at iCraft DS.', 
    id: 'Mengembangkan platform web enterprise produksi, engine AI mentor interaktif, dan produk digital berstandar tinggi di iCraft DS.' 
  },
  
  // Section Index (if any specific texts are there, typically it's numbers, but we'll add just in case)
  'index.scroll': { en: 'SCROLL DOWN', id: 'GULIR KE BAWAH' },

  // Contact
  'contact.title': { en: 'GET IN TOUCH.', id: 'HUBUNGI SAYA.' },
  'contact.desc': { en: 'Have a project in mind or just want to say hi? Feel free to reach out!', id: 'Punya proyek yang ingin didiskusikan atau sekadar ingin menyapa? Jangan ragu untuk menghubungi!' },
  'contact.email': { en: 'Send an Email', id: 'Kirim Email' },
  'contact.linkedin': { en: 'LinkedIn Profile', id: 'Profil LinkedIn' },
  'contact.heading': { en: 'What would you do if a software expert was just a click away?', id: 'Apa yang akan Anda lakukan jika ahli perangkat lunak hanya berjarak satu klik?' },

  // Footer
  'footer.designed': { en: 'Designed & Built by', id: 'Didesain & Dibangun oleh' },
  'footer.nav': { en: 'Navigation', id: 'Navigasi' },
  'footer.home': { en: 'Home', id: 'Beranda' },
  'footer.about': { en: 'About', id: 'Tentang' },
  'footer.experience': { en: 'Experience', id: 'Pengalaman' },
  'footer.tech': { en: 'Tech Stack', id: 'Teknologi' },
  'footer.works': { en: 'Recent Works', id: 'Karya Terbaru' },
  'footer.connect': { en: 'Connect', id: 'Terhubung' },
  'footer.start': { en: 'Start a project', id: 'Mulai proyek' },
  'footer.dropEmail': { en: "Interested in working together? Drop your email and I'll get back to you.", id: 'Tertarik untuk bekerja sama? Tinggalkan email Anda dan saya akan menghubungi kembali.' },
  'footer.enterEmail': { en: 'Enter your email', id: 'Masukkan email Anda' },
  'footer.rights': { en: 'All rights reserved.', id: 'Hak cipta dilindungi.' },
  'footer.backTop': { en: 'Back to top', id: 'Kembali ke atas' }
}

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en')

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'id' : 'en'))
  }

  const t = (key: string) => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found.`)
      return key
    }
    return translations[key][language]
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
