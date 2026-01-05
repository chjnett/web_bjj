
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'


import ScrollRevealItem from './ScrollRevealItem'
import TypewriterText from './TypewriterText'
import ScrollDrivenText from './ScrollDrivenText'


const AboutSection = () => {

  const values = [
    {
      image: '/icon-handshake.png',
      title: '열린 사회 철학',
      description: '칼 포퍼의 "열린 사회" 사상을 바탕으로 차이를 인정하고 서로를 존중합니다.'
    },
    {
      image: '/icon-letsroll.png',
      title: '공동체 성장',
      description: '개인의 성장이 곧 도장의 성장이 되는 건강한 커뮤니티를 만들어갑니다.'
    },
    {
      image: '/icon-gi.png',
      title: '전문성',
      description: 'IBJJF 공인 블랙벨트 지도자의 체계적이고 안전한 수련을 제공합니다.'
    },
    {
      image: '/icon-shaka.png',
      title: '포용성',
      description: '나이, 성별, 경험에 관계없이 모두가 환영받는 공간입니다.'
    }
  ]

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-max">
        <div>
          {/* Section Title */}
          <ScrollRevealItem direction="left" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">OSJ 청라 주짓수</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              2016년부터 청라에서 시작된 OSJ는 단순한 주짓수 도장을 넘어,
              <br className="hidden md:block" />
              열린 사회의 가치를 실천하는 공동체입니다.
            </p>
          </ScrollRevealItem>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {values.map((value, index) => (
              <ScrollRevealItem direction="left" delay={index}
                key={index}
                className="text-center p-6 rounded-lg bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-6">
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </ScrollRevealItem>
            ))}
          </div>

          {/* Instructor Profile - Sticky Scroll Section */}
          <InstructorProfileSection />
        </div>
      </div>
    </section >
  )
}

const InstructorProfileSection = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Animation Ranges
  // Card Entrance: 0 - 10%
  const cardScale = useTransform(scrollYProgress, [0, 0.1], [0.8, 1], { clamp: true })
  const cardOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1], { clamp: true })

  return (
    <div ref={containerRef} className="relative h-[300vh]" style={{ position: 'relative' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale: cardScale, opacity: cardOpacity }}
          className="w-full max-w-4xl bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-xl"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="w-2 h-12 bg-red-600 mr-4"></div>
              <div>
                <ScrollDrivenText
                  htmlTag="h3"
                  className="text-3xl font-bold"
                  text="이현준 관장"
                  progress={scrollYProgress}
                  range={[0.1, 0.15]}
                />
                <ScrollDrivenText
                  htmlTag="p"
                  className="text-gray-600"
                  text="IBJJF 공인 블랙벨트 1단"
                  progress={scrollYProgress}
                  range={[0.15, 0.2]}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <ScrollDrivenText
                  htmlTag="h4"
                  className="font-bold text-lg mb-3"
                  text="주요 경력"
                  progress={scrollYProgress}
                  range={[0.2, 0.25]}
                />
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <ScrollDrivenText htmlTag="span" text="• IBJJF 공인 블랙벨트 1단" progress={scrollYProgress} range={[0.25, 0.3]} />
                  </li>
                  <li>
                    <ScrollDrivenText htmlTag="span" text="• 국내외 주요 대회 심판 활동" progress={scrollYProgress} range={[0.3, 0.35]} />
                  </li>
                  <li>
                    <ScrollDrivenText htmlTag="span" text="• 다수의 국내 대회 입상" progress={scrollYProgress} range={[0.35, 0.4]} />
                  </li>
                  <li>
                    <ScrollDrivenText htmlTag="span" text="• 10년 이상의 지도 경험" progress={scrollYProgress} range={[0.4, 0.45]} />
                  </li>
                </ul>
              </div>

              <div>
                <ScrollDrivenText
                  htmlTag="h4"
                  className="font-bold text-lg mb-3"
                  text="지도 철학"
                  progress={scrollYProgress}
                  range={[0.5, 0.55]}
                />
                <ScrollDrivenText
                  htmlTag="p"
                  className="text-gray-700 leading-relaxed"
                  text="안전을 최우선으로 하며, 각 개인의 수준과 목표에 맞는 맞춤형 지도를 제공합니다. 기술적 완성도와 함께 주짓수를 통한 인격적 성장을 추구합니다."
                  progress={scrollYProgress}
                  range={[0.55, 0.8]}
                />
              </div>
            </div>

            {/* IBJJF Certificates - Fade in at end */}
            <motion.div
              style={{ opacity: useTransform(scrollYProgress, [0.8, 0.9], [0, 1]) }}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col items-center">
                <img
                  src="/02.png"
                  alt="IBJJF Certificate of Achievement - Hun Jun Lee"
                  className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-200"
                />
                <p className="text-center text-sm text-gray-600 mt-3">
                  IBJJF Rule Seminar/Webinar 과정 수료
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutSection
