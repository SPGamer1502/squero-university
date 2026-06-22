'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateCoursePage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('courses').insert({ name, description, created_by: user.id })
    if (!error) router.push('/courses')
    else alert(error.message)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '40px', marginBottom: '0.5rem' }}>📚</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a365d' }}>Crear Nuevo Curso</h1>
        </div>
        <div className="card">
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Nombre del curso</label>
              <input type="text" placeholder="Ej: Matemática Básica" value={name} onChange={e => setName(e.target.value)}
                className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea placeholder="Descripción del curso..." value={description} onChange={e => setDescription(e.target.value)}
                className="form-input" style={{ minHeight: '100px' }} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-success" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {loading ? 'Creando...' : '✨ Crear Curso'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}