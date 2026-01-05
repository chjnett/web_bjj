import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Analytics tracking
export const trackEvent = async (eventType, visitorId = null) => {
  try {
    const { error } = await supabase
      .from('analytics')
      .insert([
        {
          event_type: eventType,
          visitor_id: visitorId || generateVisitorId(),
          created_at: new Date().toISOString()
        }
      ])

    if (error) throw error
  } catch (error) {
    console.error('Analytics tracking error:', error)
  }
}

// Generate or retrieve visitor ID from localStorage
const generateVisitorId = () => {
  let visitorId = localStorage.getItem('osj_visitor_id')
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('osj_visitor_id', visitorId)
  }
  return visitorId
}
