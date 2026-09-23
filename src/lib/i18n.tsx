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
  // Navbar
  'nav.contact': { en: 'Contact', id: 'Kontak' },
  
  // Hero
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

  // Tech Stack
  'tech.title': { en: 'Technologies I work with', id: 'Teknologi yang saya gunakan' },

  // Recent Works
  'works.featured': { en: 'Featured Projects', id: 'Proyek Unggulan' },
  'works.view': { en: 'View Project', id: 'Lihat Proyek' },
  'works.title1': { en: 'Portfolio & Previous', id: 'Portofolio & Proyek' },
  'works.title2': { en: 'Projects', id: 'Sebelumnya' },
  'works.desc': { 
    en: "I've built a variety of projects tailored to different aspects of each client's business. If you'd like to see more examples beyond what's showcased here, feel free to", 
    id: 'Saya telah membangun berbagai proyek yang disesuaikan dengan berbagai aspek bisnis klien. Jika Anda ingin melihat lebih banyak contoh di luar apa yang ditampilkan di sini, jangan ragu untuk' 
  },
  'works.contact': { en: "get in touch", id: "menghubungi saya" },
  'works.share': { en: "— I'd be happy to share.", id: "— saya akan dengan senang hati membagikannya." },
  'works.scroll': { en: 'Scroll to See Projects', id: 'Gulir untuk Melihat Proyek' },
  'works.built': { en: 'Built with: ', id: 'Dibangun dengan: ' },
  'works.code': { en: 'View the code', id: 'Lihat kode' },
  'works.mobileTitle': { en: 'Recent Works', id: 'Karya Terbaru' },
  'works.mobileSub': { en: 'Selected projects.', id: 'Proyek pilihan.' },
  
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
