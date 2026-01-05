import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  LogOut,
  BarChart3,
  Image as ImageIcon,
  Calendar,
  DollarSign,
  Mail,
  Upload,
  X,
  Edit2,
  Save
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('analytics')

  // Data states
  const [analytics, setAnalytics] = useState([])
  const [newsPosts, setNewsPosts] = useState([])
  const [schedules, setSchedules] = useState([])
  const [pricing, setPricing] = useState([])
  const [inquiries, setInquiries] = useState([])

  // Upload states
  const [uploading, setUploading] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', file: null, preview: null })

  const [editingSchedule, setEditingSchedule] = useState(null)
  const [editingPricing, setEditingPricing] = useState(null)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchAllData()
    }
  }, [user])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        navigate('/admin/login')
        return
      }

      setUser(session.user)
    } catch (error) {
      console.error('Auth error:', error)
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllData = async () => {
    try {
      // Fetch analytics
      const { data: analyticsData } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      setAnalytics(analyticsData || [])

      // Fetch news posts
      const { data: newsData } = await supabase
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false })

      setNewsPosts(newsData || [])

      // Fetch schedules
      const { data: schedulesData } = await supabase
        .from('schedule_calendar')
        .select('*')
        .order('time_slot', { ascending: true })

      setSchedules(schedulesData || [])

      // Fetch pricing
      const { data: pricingData } = await supabase
        .from('pricing_table')
        .select('*')
        .order('id', { ascending: true })

      setPricing(pricingData || [])

      // Fetch inquiries
      const { data: inquiriesData } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      setInquiries(inquiriesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewPost({
        ...newPost,
        file,
        preview: URL.createObjectURL(file)
      })
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPost.file) {
      alert('이미지를 선택해주세요.')
      return
    }

    setUploading(true)
    try {
      // 1. Upload Image
      const fileExt = newPost.file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(fileName, newPost.file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(fileName)

      // 2. Insert Post
      // Fix: Since the DB schema only has 'caption' and not 'title'/'content',
      // we combine them or just use caption to prevent 400 error.
      const combinedCaption = newPost.title ? `${newPost.title}\n\n${newPost.content}` : newPost.content

      const { error: insertError } = await supabase
        .from('news_posts')
        .insert([{
          caption: combinedCaption,
          image_url: publicUrl
        }])

      if (insertError) throw insertError

      // Reset form
      setNewPost({ title: '', content: '', file: null, preview: null })
      fetchAllData()
      alert('소식이 등록되었습니다.')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('소식 등록 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteNewsPost = async (id, imageUrl) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      // Delete from database
      const { error: deleteError } = await supabase
        .from('news_posts')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Delete from storage
      const fileName = imageUrl.split('/').pop()
      await supabase.storage.from('news-images').remove([fileName])

      fetchAllData()
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleUpdateSchedule = async (schedule) => {
    try {
      const { error } = await supabase
        .from('schedule_calendar')
        .update(schedule)
        .eq('id', schedule.id)

      if (error) throw error

      setEditingSchedule(null)
      fetchAllData()
    } catch (error) {
      console.error('Error updating schedule:', error)
    }
  }

  const handleUpdatePricing = async (plan) => {
    try {
      const { error } = await supabase
        .from('pricing_table')
        .update(plan)
        .eq('id', plan.id)

      if (error) throw error

      setEditingPricing(null)
      fetchAllData()
    } catch (error) {
      console.error('Error updating pricing:', error)
    }
  }

  const getAnalyticsChartData = () => {
    const dailyVisits = {}

    analytics.forEach(event => {
      const date = new Date(event.created_at).toLocaleDateString('ko-KR')
      if (!dailyVisits[date]) {
        dailyVisits[date] = 0
      }
      if (event.event_type === 'page_visit') {
        dailyVisits[date]++
      }
    })

    return Object.entries(dailyVisits).map(([date, count]) => ({
      date,
      visits: count
    })).slice(-7)
  }

  const getEventTypeData = () => {
    const eventCounts = {}

    analytics.forEach(event => {
      if (!eventCounts[event.event_type]) {
        eventCounts[event.event_type] = 0
      }
      eventCounts[event.event_type]++
    })

    return Object.entries(eventCounts).map(([type, count]) => ({
      type,
      count
    }))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/01.png" alt="OSJ Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold">OSJ 관리자 대시보드</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-6">
            {[
              { id: 'analytics', name: '통계', icon: <BarChart3 size={18} /> },
              { id: 'news', name: '소식 관리', icon: <ImageIcon size={18} /> },
              { id: 'schedules', name: '시간표', icon: <Calendar size={18} /> },
              { id: 'pricing', name: '수업료', icon: <DollarSign size={18} /> },
              { id: 'inquiries', name: '문의', icon: <Mail size={18} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-black'
                  }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-gray-600 text-sm mb-2">총 방문자 수</h3>
                <p className="text-3xl font-bold">
                  {analytics.filter(a => a.event_type === 'page_visit').length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-gray-600 text-sm mb-2">총 문의 수</h3>
                <p className="text-3xl font-bold">{inquiries.length}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-gray-600 text-sm mb-2">소식 게시물 수</h3>
                <p className="text-3xl font-bold">{newsPosts.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold mb-4">일별 방문자 수</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getAnalyticsChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#E53E3E" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold mb-4">이벤트 유형별 통계</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getEventTypeData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-8">
            {/* Create Post Form */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold mb-6">새 소식 등록</h3>
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Upload Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">대표 이미지</label>
                    <div className={`relative aspect-video rounded-xl border-2 border-dashed ${newPost.preview ? 'border-transparent' : 'border-gray-300 hover:border-red-500'} bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {newPost.preview ? (
                        <img src={newPost.preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
                          <p className="text-sm text-gray-500">클릭하여 이미지 업로드</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                      <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        placeholder="소식 제목을 입력하세요"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                      <textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all h-32 resize-none"
                        placeholder="상세 내용을 입력하세요"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {uploading ? (
                      <span>등록 중...</span>
                    ) : (
                      <>
                        <Upload size={20} />
                        <span>소식 등록하기</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* News List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsPosts.map(post => (
                <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md group border border-gray-100">
                  <div className="relative aspect-video">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteNewsPost(post.id, post.image_url)}
                        className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transform hover:scale-110 transition-all"
                        title="삭제"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-lg mb-2 line-clamp-1">{post.title || '제목 없음'}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content || post.caption || '내용 없음'}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold whitespace-nowrap min-w-[100px]">구분</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold whitespace-nowrap min-w-[100px]">시간대</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold whitespace-nowrap min-w-[80px]">월</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold whitespace-nowrap min-w-[80px]">화</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold whitespace-nowrap min-w-[80px]">수</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold whitespace-nowrap min-w-[80px]">목</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold whitespace-nowrap min-w-[80px]">금</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold whitespace-nowrap min-w-[80px]">토</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold whitespace-nowrap min-w-[80px]">수정</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(schedule => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      {editingSchedule?.id === schedule.id ? (
                        <>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={editingSchedule.category || ''}
                              onChange={(e) => setEditingSchedule({ ...editingSchedule, category: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                              placeholder="구분"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={editingSchedule.time_slot || ''}
                              onChange={(e) => setEditingSchedule({ ...editingSchedule, time_slot: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                              placeholder="시간대"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={editingSchedule.mon || ''}
                              onChange={(e) => setEditingSchedule({ ...editingSchedule, mon: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={editingSchedule.tue || ''}
                              onChange={(e) => setEditingSchedule({ ...editingSchedule, tue: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={editingSchedule.wed || ''}
                              onChange={(e) => setEditingSchedule({ ...editingSchedule, wed: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={editingSchedule.thu || ''}
                              onChange={(e) => setEditingSchedule({ ...editingSchedule, thu: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={editingSchedule.fri || ''}
                              onChange={(e) => setEditingSchedule({ ...editingSchedule, fri: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={editingSchedule.sat || ''}
                              onChange={(e) => setEditingSchedule({ ...editingSchedule, sat: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleUpdateSchedule(editingSchedule)}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                              >
                                <Save size={14} />
                              </button>
                              <button
                                onClick={() => setEditingSchedule(null)}
                                className="px-2 py-1 bg-gray-200 rounded text-xs"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-gray-300 px-4 py-3 font-semibold">
                            {schedule.category}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            {schedule.time_slot}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center whitespace-pre-line">
                            {schedule.mon}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center whitespace-pre-line">
                            {schedule.tue}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center whitespace-pre-line">
                            {schedule.wed}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center whitespace-pre-line">
                            {schedule.thu}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center whitespace-pre-line">
                            {schedule.fri}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center whitespace-pre-line">
                            {schedule.sat}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            <button
                              onClick={() => setEditingSchedule(schedule)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <Edit2 size={18} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold">수업일수</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold">키즈반<br />(유치부, 초등부)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold">중, 고등부</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold">성인부</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold">수정</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {editingPricing?.id === row.id ? (
                        <>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={editingPricing.frequency || ''}
                              onChange={(e) => setEditingPricing({ ...editingPricing, frequency: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                              placeholder="수업일수"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <textarea
                              value={editingPricing.class_type || ''}
                              onChange={(e) => setEditingPricing({ ...editingPricing, class_type: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                              rows="2"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <textarea
                              value={editingPricing.middle_high || ''}
                              onChange={(e) => setEditingPricing({ ...editingPricing, middle_high: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                              rows="2"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <textarea
                              value={editingPricing.adult || ''}
                              onChange={(e) => setEditingPricing({ ...editingPricing, adult: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm"
                              rows="2"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleUpdatePricing(editingPricing)}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                              >
                                <Save size={14} />
                              </button>
                              <button
                                onClick={() => setEditingPricing(null)}
                                className="px-2 py-1 bg-gray-200 rounded text-xs"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-gray-300 px-4 py-3 font-semibold text-center">
                            {row.frequency}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center whitespace-pre-line">
                            {row.class_type}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center whitespace-pre-line">
                            {row.middle_high}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center whitespace-pre-line">
                            {row.adult}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            <button
                              onClick={() => setEditingPricing(row)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <Edit2 size={18} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.length > 0 ? (
              inquiries.map(inquiry => (
                <div key={inquiry.id} className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{inquiry.sender_name}</h3>
                      <p className="text-gray-600">{inquiry.phone}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(inquiry.created_at).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {inquiry.status === 'pending' ? '대기 중' : '처리 완료'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-12 text-center text-gray-500">
                아직 접수된 문의가 없습니다.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
