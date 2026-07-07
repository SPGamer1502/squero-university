'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function CreateExamPage() {
  const params = useParams()
  const courseId = parseInt(params.id as string)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLimit, setTimeLimit] = useState(30)
  const [maxAttempts, setMaxAttempts] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('exams').insert({
      course_id: courseId,
      title,
      description,
      time_limit_minutes: timeLimit,
      max_attempts: maxAttempts,
      created_by: user.id
    })

    if (error) alert('Error: ' + error.message)
    else {
      alert('✅ Examen creado. Ahora puedes agregarle preguntas.')
      router.push(`/courses/${courseId}/exams`)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#1e40af' }}>📝 Crear nuevo examen</h1>
      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Título</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Tiempo límite (minutos)</label>
          <input type="number" value={timeLimit} onChange={e => setTimeLimit(parseInt(e.target.value))} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Máximo de intentos</label>
          <input type="number" value={maxAttempts} onChange={e => setMaxAttempts(parseInt(e.target.value))} className="form-input" required />
        </div>
        <button type="submit" disabled={loading} className="btn btn-success" style={{ width: '100%' }}>
          {loading ? 'Creando...' : '✨ Crear examen'}
        </button>
      </form>
    </div>
  )
}