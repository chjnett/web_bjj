import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Instagram, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ScrollRevealItem from './ScrollRevealItem'

const NewsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedPost, setSelectedPost] = useState(null)

  const [newsPosts, setNewsPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNewsPosts()
  }, [])

  const fetchNewsPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      // Process data to extract title/content from caption if needed
      const processedData = (data || []).map(post => {
        let title = post.title
        let content = post.content

        // If title/content are empty but caption exists (from Admin Dashboard fix)
        // Try to split caption: "Title\n\nContent"
        if (!title && !content && post.caption) {
          const parts = post.caption.split('\n\n')
          if (parts.length >= 2) {
            title = parts[0]
            content = parts.slice(1).join('\n\n')
          } else {
            content = post.caption
          }
        }

        return {
          ...post,
          title: title || '공지',
          content: content || ''
        }
      })

      setNewsPosts(processedData)
    } catch (error) {
      console.error('Error fetching news posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const posts = newsPosts.length > 0 ? newsPosts : []

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1))
  }

  // Get visible indices (circular)
  const getVisibleIndex = (offset) => {
    let index = activeIndex + offset
    if (index < 0) index = posts.length + index
    if (index >= posts.length) index = index - posts.length
    return index
  }

  return (
    <section id="news" className="section-padding bg-black text-white overflow-hidden min-h-[800px] flex flex-col justify-center">
      <div className="container-max relative z-10">
        <ScrollRevealItem className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">공지</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-400">
            OSJ의 다양한 활동과 소식을 확인하세요
          </p>
        </ScrollRevealItem>

        {/* 3D Carousel Container */}
        <div className="relative h-[500px] w-full max-w-5xl mx-auto flex items-center justify-center perspective-1000">
          <div className="relative w-full h-full flex items-center justify-center">
            {posts.map((post, index) => {
              // Calculate relative position to active index
              // We need to handle circular logic for the visual positioning
              // Simplest way for 3D carousel: map all, but style based on distance

              let offset = index - activeIndex
              // Adjust for wrap-around to find shortest path
              if (offset > posts.length / 2) offset -= posts.length
              if (offset < -posts.length / 2) offset += posts.length

              // Only render nearby items to avoid clutter
              if (Math.abs(offset) > 2) return null

              const isActive = offset === 0

              return (
                <motion.div
                  key={post.id}
                  className={`absolute w-[60vw] md:w-[600px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 bg-gray-900 cursor-pointer`}
                  initial={false}
                  animate={{
                    x: offset * 350, // Move 350px per step
                    scale: isActive ? 1 : 0.7,
                    opacity: isActive ? 1 : 0.4,
                    zIndex: isActive ? 10 : 5 - Math.abs(offset),
                    rotateY: offset * -15,   // Rotate inward
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => {
                    if (isActive) {
                      setSelectedPost(post)
                    } else {
                      setActiveIndex(index)
                    }
                  }}
                  style={{
                    boxShadow: isActive ? '0 20px 50px rgba(0,0,0,0.5)' : 'none',
                    filter: isActive ? 'brightness(1)' : 'brightness(0.5)'
                  }}
                >
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Content */}
                  <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/50 to-transparent text-left transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <h3 className="text-3xl font-bold mb-2 text-white drop-shadow-lg transform translate-y-0">
                      {post.title || '제목 없음'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 border border-white/30 rounded-full text-sm text-gray-200 backdrop-blur-sm">
                        {post.content || post.caption || 'OSJ News'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-0 z-20 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white border border-white/10"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-0 z-20 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white border border-white/10"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Instagram Link (Bottom) */}
        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/osjchungra/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:scale-105 border border-white/10 backdrop-blur-sm"
          >
            <Instagram size={20} />
            <span className="font-semibold">인스타그램 방문하기</span>
          </a>
        </div>

        {/* Full Image Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-10 cursor-zoom-out"
            >
              <div
                className="relative w-full max-w-6xl max-h-full flex flex-col items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-0 right-0 p-4 text-white hover:text-red-500 transition-colors z-50"
                >
                  <X size={40} />
                </button>

                <motion.img
                  layoutId={`image-${selectedPost.id}`}
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />

                <div className="text-center mt-6 max-w-2xl">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedPost.title}</h3>
                  <p className="text-gray-300 text-lg whitespace-pre-wrap">{selectedPost.content}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Gradient Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>
    </section>
  )
}

export default NewsSection
