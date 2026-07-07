'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForumToggle({ courseId, enabled }: { courseId: number; enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const supabase = createClient()
  const router = useRouter()

  const toggle = async () => {
    const newState = !isEnabled
    const { error } = await supabase.from('courses').update({ forum_enabled: newState }).eq('id', courseId)
    if (!error) {
      setIsEnabled(newState)
      router.refresh()
    }
  }

  return (
    <button onClick={toggle} className={`btn btn-sm ${isEnabled ? 'btn-success' : 'btn-outline'}`}>
      {isEnabled ? '✅ Foro activo' : '❌ Foro inactivo'}
    </button>
  )
}