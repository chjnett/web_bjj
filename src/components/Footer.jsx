import { Instagram, Mail, BookOpen } from 'lucide-react'
import ScrollRevealItem from './ScrollRevealItem'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container-max px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <ScrollRevealItem direction="up" delay={0}>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/01.png" alt="OSJ Logo" className="h-10 w-10 invert" />
              <div>
                <h3 className="font-bold text-lg">OSJ 청라 주짓수</h3>
                <p className="text-sm text-gray-400">Open Society Jiu Jitsu</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              차이를 인정하며 함께 성장하는<br />
              osj 청라 주짓수
            </p>
          </ScrollRevealItem>

          {/* Quick Links */}
          <ScrollRevealItem direction="up" delay={1}>
            <h4 className="font-bold mb-4">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  소개
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  프로그램
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  소식
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  문의
                </button>
              </li>
            </ul>
          </ScrollRevealItem>

          {/* Contact */}
          <ScrollRevealItem direction="up" delay={2}>
            <h4 className="font-bold mb-4">연락처</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>인천 서구 청라에메랄드로 102번길 26</li>
              <li>서진프라자 201호</li>
              <li>osjchungra@naver.com</li>
              <li className="flex space-x-3 pt-2">
                <a
                  href="https://www.instagram.com/osjchungra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://blog.naver.com/osjchungra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <BookOpen size={20} />
                </a>
                <a
                  href="mailto:osjchungra@naver.com"
                  className="hover:text-white transition-colors"
                >
                  <Mail size={20} />
                </a>
              </li>
            </ul>
          </ScrollRevealItem>
        </div>

        <ScrollRevealItem direction="up" delay={3} className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2026 OSJ 청라 주짓수. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Since 2016 | IBJJF Affiliated
          </p>
        </ScrollRevealItem>
      </div>
    </footer>
  )
}

export default Footer
