import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ProgramsSection from '../components/ProgramsSection'
import NewsSection from '../components/NewsSection'

import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <NewsSection />

      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
