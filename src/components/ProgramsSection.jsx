import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ScrollRevealItem from './ScrollRevealItem'
import { Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ProgramsSection = () => {
  const [schedules, setSchedules] = useState([])
  const [pricing, setPricing] = useState([])

  useEffect(() => {
    fetchSchedules()
    fetchPricing()
  }, [])

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_calendar')
        .select('*')
        .order('time_slot', { ascending: true })

      if (error) throw error
      setSchedules(data || [])
    } catch (error) {
      console.error('Error fetching schedules:', error)
      // Fallback data with calendar structure
      setSchedules([
        { id: 1, category: '키즈수업', time_slot: '초등1부 2:30~3:20', mon: '도복 수련', tue: '', wed: '도복 수련', thu: '', fri: '도복 수련', sat: '' },
        { id: 2, category: '키즈수업', time_slot: '유초등2부 4:30~5:20', mon: '', tue: '', wed: '도복 수련', thu: '', fri: '', sat: '' },
        { id: 3, category: '키즈수업', time_slot: '초등3부 5:30~6:20', mon: '', tue: '', wed: '도복 수련', thu: '', fri: '', sat: '' },
        { id: 4, category: '오후', time_slot: '8:00 ~ 9:00', mon: '도복', tue: '도복', wed: '도복', thu: '도복', fri: '도복', sat: '' },
        { id: 5, category: '오후', time_slot: '9:00 ~ 10:00', mon: '오픈매트', tue: '도복', wed: '오픈매트', thu: '도복\n노기(하계)', fri: '', sat: '' }
      ])
    }
  }

  const fetchPricing = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_table')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      setPricing(data || [])
    } catch (error) {
      console.error('Error fetching pricing:', error)
      // Fallback data
      setPricing([
        { id: 1, frequency: '주2회', class_type: '', middle_high: '', adult: '14만원(VAT포함)' },
        { id: 2, frequency: '주3회', class_type: '', middle_high: '', adult: '16만원(VAT포함)' },
        { id: 3, frequency: '주5회', class_type: '', middle_high: '', adult: '18만원(VAT포함)' },
        { id: 4, frequency: '쿠폰제(10회)', class_type: '22만원\n(4개월제한)', middle_high: '도복(입문용)', adult: '10만원' }
      ])
    }
  }

  return (
    <section id="programs" className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-max">
        <div>

          {/* Section Title */}
          <ScrollRevealItem className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">프로그램 안내</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-700">
              나이와 수준에 맞는 다양한 프로그램을 운영합니다
            </p>
          </ScrollRevealItem>

          {/* Schedule Calendar */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <Calendar className="mr-3" />
              수업 시간표
            </h3>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Calendar Header */}
              <div
                className="text-white p-6"
                style={{
                  backgroundImage: "url('/table_header_bg.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <h4 className="text-2xl font-bold">시간표</h4>
              </div>

              {/* Calendar Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[120px]">구분</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[100px]">월</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[100px]">화</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[100px]">수</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[100px]">목</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[100px]">금</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[100px]">토</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule, index) => (
                      <ScrollRevealItem
                        tag="tr"
                        direction="left"
                        delay={index}
                        key={schedule.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border border-gray-300 px-4 py-4 font-semibold text-gray-800 bg-yellow-50">
                          {schedule.category && (
                            <div className="text-xs text-gray-600 mb-1">{schedule.category}</div>
                          )}
                          <div className="text-sm">{schedule.time_slot}</div>
                        </td>
                        <td className="border border-gray-300 px-4 py-4 text-center text-gray-700 whitespace-pre-line">
                          {schedule.mon || ''}
                        </td>
                        <td className="border border-gray-300 px-4 py-4 text-center text-gray-700 whitespace-pre-line">
                          {schedule.tue || ''}
                        </td>
                        <td className="border border-gray-300 px-4 py-4 text-center text-gray-700 whitespace-pre-line">
                          {schedule.wed || ''}
                        </td>
                        <td className="border border-gray-300 px-4 py-4 text-center text-gray-700 whitespace-pre-line">
                          {schedule.thu || ''}
                        </td>
                        <td className="border border-gray-300 px-4 py-4 text-center text-gray-700 whitespace-pre-line">
                          {schedule.fri || ''}
                        </td>
                        <td className="border border-gray-300 px-4 py-4 text-center text-gray-700 whitespace-pre-line">
                          {schedule.sat || ''}
                        </td>
                      </ScrollRevealItem>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes Section */}
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-700">
                  <p>*No-Go(노기)란: 도복을 입지 않고 반팔티(래쉬가드추천), 반바지를 입고하는 그래플링 수업을 뜻함</p>
                  <p>*상기 시간은 계절에 따라 회원 분들 수요에 따라 추가, 변동 가능합니다.</p>
                  <p>*등록일 횟수 기준 <span className="font-semibold">주5회 월20회, 주3회 12회, 주2회 8회</span>로 수업일이 산정됩니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8">수업료</h3>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Pricing Header */}
              <div
                className="text-white p-6"
                style={{
                  backgroundImage: "url('/table_header_bg.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <h4 className="text-2xl font-bold">수업료</h4>
              </div>

              {/* Pricing Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[120px]">수업일수</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[150px]">키즈반<br />(유치부, 초등부)</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[120px]">중, 고등부</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 min-w-[120px]">성인부</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricing.map((row, index) => (
                      <ScrollRevealItem
                        tag="tr"
                        direction="left"
                        delay={index}
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border border-gray-300 px-4 py-4 font-semibold text-gray-800 bg-yellow-50 text-center">
                          {row.frequency}
                        </td>
                        <td className="border border-gray-300 px-4 py-4 text-center text-gray-700 whitespace-pre-line">
                          {row.class_type || ''}
                        </td>
                        <td className="border border-gray-300 px-4 py-4 text-center text-gray-700 whitespace-pre-line">
                          {row.middle_high || ''}
                        </td>
                        <td className="border border-gray-300 px-4 py-4 text-center text-gray-700 whitespace-pre-line">
                          {row.adult || ''}
                        </td>
                      </ScrollRevealItem>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pricing Notes */}
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-700">
                  <p>*일일 회비-3만원</p>
                  <p>*키즈부 차량미운영 1만원 차감</p>
                  <p>*키즈부 결제일 매월 1일(4주정산) 입문자 3개월 등록 시 도복증정</p>
                  <p>*개인레슨 1회 10만원 10회 70만원 20회 100만원</p>
                  <p className="mt-4 font-semibold">*가족패키지*</p>
                  <p>가족,형제지간 같이 등록시 1만원씩 할인(월기준)</p>
                  <p className="mt-4">계좌번호(우리) 1002-649-512901</p>
                  <p>예금주: 이현준</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProgramsSection
