'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForumToggle({ courseId, enabled }: { courseId: number; enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const toggle = async () => {
    setError(null)
    const newState = !isEnabled
    const { error: updateError } = await supabase
      .from('courses')
      .update({ forum_enabled: newState })
      .eq('id', courseId)

    if (updateError) {
      setError('No tienes permisos para cambiar el foro.')
      return
    }

    setIsEnabled(newState)
    router.refresh()
  }

  return (
    <div>
      <button onClick={toggle} className={`btn btn-sm ${isEnabled ? 'btn-success' : 'btn-outline'}`}>
        {isEnabled ? '✅ Foro activo' : '❌ Foro inactivo'}
      </button>
      {error && <small style={{ color: 'red', marginLeft: '8px' }}>{error}</small>}
    </div>
  )
}