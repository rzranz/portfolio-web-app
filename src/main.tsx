import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './lib/i18n.tsx'
import { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

const initParticles = async (engine: any) => {
  await loadSlim(engine)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParticlesProvider init={initParticles}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ParticlesProvider>
  </StrictMode>,
)
