'use client'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function CreateAssignmentPage() {
  const params = useParams()
  const courseId = parseInt(params.id as string)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    let fileUrl = ''
    
    if (file) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assignment-files')
        .upload(`${courseId}/${Date.now()}-${file.name}`, file)
      if (uploadError) { alert(uploadError.message); setLoading(false); return }
      fileUrl = uploadData?.path || ''
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { error } = await supabase.from('assignments').insert({
      course_id: courseId,
      title,
      description,
      due_date: new Date(dueDate).toISOString(),
      file_url: fileUrl,
      created_by: user.id
    })

    if (error) {
      alert('Error: ' + error.message)
      console.error(error)
    } else {
      alert('✅ Tarea creada con éxito')
      router.push(`/courses/${courseId}`)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '550px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a365d' }}>📝 Nueva Tarea</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Curso ID: {courseId}</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Título</label>
              <input type="text" placeholder="Título de la tarea" value={title} onChange={e => setTitle(e.target.value)}
                className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea placeholder="Instrucciones..." value={description} onChange={e => setDescription(e.target.value)}
                className="form-input" style={{ minHeight: '80px' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha límite</label>
              <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Archivo adjunto (opcional)</label>
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)}
                className="form-input" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-success" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {loading ? 'Creando...' : '📤 Crear tarea'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}