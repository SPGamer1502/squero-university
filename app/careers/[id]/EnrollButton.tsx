'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function EnrollButton({ courseId }: { courseId: number }) {
  const supabase = createClient()
  const router = useRouter()

  const enroll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: existing } = await supabase.from('enrollments')
      .select('*').eq('user_id', user.id).eq('course_id', courseId).maybeSingle()

    if (existing) {
      alert('Ya estás inscrito')
      return
    }

    const { error } = await supabase.from('enrollments').insert({
      user_id: user.id,
      course_id: courseId
    })

    if (error) alert('Error: ' + error.message)
    else {
      alert('¡Inscrito con éxito!')
      router.refresh()
    }
  }

  return (
    <button onClick={enroll} style={{
      backgroundColor: '#2563eb', color: 'white', padding: '8px 16px',
      border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
    }}>
      Inscribirse
    </button>
  )
}