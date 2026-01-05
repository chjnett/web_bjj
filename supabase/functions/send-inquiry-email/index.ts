// Supabase Edge Function to send email notifications
// Deploy this function using: supabase functions deploy send-inquiry-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = 'osjchungra@naver.com'

serve(async (req) => {
  try {
    const { record } = await req.json()

    // Send email using Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'OSJ 청라 주짓수 <noreply@yourdomain.com>',
        to: ADMIN_EMAIL,
        subject: `[OSJ 문의] ${record.sender_name}님의 새로운 문의`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E53E3E;">새로운 문의가 접수되었습니다</h2>

            <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>이름:</strong> ${record.sender_name}</p>
              <p><strong>연락처:</strong> ${record.phone}</p>
              <p><strong>접수 시간:</strong> ${new Date(record.created_at).toLocaleString('ko-KR')}</p>
            </div>

            <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h3>문의 내용:</h3>
              <p style="white-space: pre-wrap;">${record.message}</p>
            </div>

            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              이 메일은 OSJ 청라 주짓수 웹사이트에서 자동으로 발송되었습니다.
            </p>
          </div>
        `
      })
    })

    const data = await res.json()

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
