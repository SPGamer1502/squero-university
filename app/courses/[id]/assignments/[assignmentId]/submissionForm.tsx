'use client'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmissionForm({ assignmentId: initialAssignmentId }: { assignmentId: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [assignmentId, setAssignmentId] = useState<number>(parseInt(initialAssignmentId))
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Si initialAssignmentId no es un número válido, lo obtenemos de la URL
  useEffect(() => {
    if (isNaN(parseInt(initialAssignmentId))) {
      const path = window.location.pathname
      const match = path.match(/\/courses\/\d+\/assignments\/(\d+)/)
      if (match) {
        setAssignmentId(parseInt(match[1]))
      }
    }
  }, [initialAssignmentId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)

    if (isNaN(assignmentId)) {
      alert('Error: No se pudo identificar la tarea.')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data: uploadData, error } = await supabase.storage
      .from('submissions')
      .upload(`${assignmentId}/${user.id}/${Date.now()}-${file.name}`, file)

    if (error) {
      alert('Error al subir archivo: ' + error.message)
      setLoading(false)
      return
    }

    const fileUrl = uploadData?.path || ''
    const { error: insertError } = await supabase.from('submissions').insert({
      assignment_id: assignmentId,
      user_id: user.id,
      file_url: fileUrl,
    })

    if (insertError) {
      alert('Error al guardar entrega: ' + insertError.message)
    } else {
      alert('✅ Tarea entregada con éxito')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Selecciona tu archivo</label>
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="form-input"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {loading ? 'Subiendo...' : '📤 Entregar tarea'}
      </button>
    </form>
  )
}