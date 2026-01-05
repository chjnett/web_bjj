import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'

const HeroSection = () => {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [text3, setText3] = useState('')

  const { scrollY } = useScroll()
  const imageOpacity = useTransform(scrollY, [0, 300], [0, 1])
  const imageScale = useTransform(scrollY, [0, 300], [0.8, 1])
  const imageY = useTransform(scrollY, [0, 300], [50, 0])

  const fullText1 = 'OPEN SOCIETY JIU JITSU'
  const fullText2 = '차이를 인정하며 함께 성장하는'
  const fullText3 = 'OSJ 청라 주짓수'

  useEffect(() => {
    let index1 = 0
    const timer1 = setInterval(() => {
      if (index1 <= fullText1.length) {
        setText1(fullText1.slice(0, index1))
        index1++
      } else {
        clearInterval(timer1)
      }
    }, 80)

    setTimeout(() => {
      let index2 = 0
      const timer2 = setInterval(() => {
        if (index2 <= fullText2.length) {
          setText2(fullText2.slice(0, index2))
          index2++
        } else {
          clearInterval(timer2)
        }
      }, 60)
      return () => clearInterval(timer2)
    }, fullText1.length * 80 + 200)

    setTimeout(() => {
      let index3 = 0
      const timer3 = setInterval(() => {
        if (index3 <= fullText3.length) {
          setText3(fullText3.slice(0, index3))
          index3++
        } else {
          clearInterval(timer3)
        }
      }, 60)
      return () => clearInterval(timer3)
    }, fullText1.length * 80 + fullText2.length * 60 + 400)

    return () => clearInterval(timer1)
  }, [])

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
      </div>

      {/* Logo Animation - Scroll Triggered */}
      <motion.div
        style={{
          opacity: imageOpacity,
          scale: imageScale,
          y: imageY
        }}
        className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
      >
        <img
          src="/04.png"
          alt="OSJ Logo"
          className="w-[90vw] h-[90vh] md:w-[85vw] md:h-[85vh] object-contain max-w-none opacity-80"
        />
      </motion.div>

      <div className="relative z-10 text-center px-6 pt-20">

        {/* Brand Name - Typing Effect */}
        <div className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 min-h-[120px] md:min-h-[180px] lg:min-h-[220px]">
          <div className="relative inline-block">
            {text1.split(' ').map((word, index) => (
              <span key={index}>
                {word}
                {index < text1.split(' ').length - 1 && (index === 1 ? <br /> : ' ')}
              </span>
            ))}
            <span className="animate-pulse">|</span>
          </div>
        </div>

        {/* Subtitle - Typing Effect */}
        <div className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-6 min-h-[40px] md:min-h-[50px]">
          <span>{text2}</span>
          {text2.length < fullText2.length && <span className="animate-pulse">|</span>}
        </div>

        <div className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-12 min-h-[50px] md:min-h-[60px]">
          <span>{text3}</span>
          {text3.length < fullText3.length && text2.length === fullText2.length && (
            <span className="animate-pulse">|</span>
          )}
        </div>

        {/* CTA Badge */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="inline-block"
        >
          <div className="px-8 py-3 border-2 border-black rounded-full">
            <p className="text-sm md:text-base font-medium">
              Since 2016 | 청라 프리미엄 주짓수 도장
            </p>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          onClick={scrollToAbout}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={32} className="text-black" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  )
}

export default HeroSection
