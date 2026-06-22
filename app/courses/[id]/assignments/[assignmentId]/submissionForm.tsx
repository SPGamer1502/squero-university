'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmissionForm({ assignmentId }: { assignmentId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: uploadData, error } = await supabase.storage
      .from('submissions')
      .upload(`${assignmentId}/${user.id}/${Date.now()}-${file.name}`, file)

    if (error) { alert('Error al subir: ' + error.message); return }

    const fileUrl = uploadData?.path || ''
    const { error: insertError } = await supabase.from('submissions').insert({
      assignment_id: parseInt(assignmentId),
      user_id: user.id,
      file_url: fileUrl
    })

    if (insertError) alert('Error: ' + insertError.message)
    else {
      alert('✅ Tarea entregada con éxito')
      router.refresh()
    }
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '1rem' }}>📤 Subir entrega</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} required
          style={{ marginBottom: '1rem' }} />
        <button type="submit" style={{
          backgroundColor: '#2563eb', color: 'white', padding: '10px 20px',
          border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
        }}>
          Entregar tarea
        </button>
      </form>
    </div>
  )
}