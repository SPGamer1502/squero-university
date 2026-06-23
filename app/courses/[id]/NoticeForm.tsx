'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Notice {
  id?: number
  title: string
  content: string
  is_permanent: boolean
  expires_at: string | null
}

export default function NoticeForm({ courseId, notice }: { courseId: number; notice?: Notice | null }) {
  const [title, setTitle] = useState(notice?.title || '')
  const [content, setContent] = useState(notice?.content || '')
  const [isPermanent, setIsPermanent] = useState(notice?.is_permanent ?? false)
  const [expiresAt, setExpiresAt] = useState(notice?.expires_at ? new Date(notice.expires_at).toISOString().slice(0, 16) : '')
  const [showForm, setShowForm] = useState(false)   // controla si se muestra el formulario
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      course_id: courseId,
      title,
      content,
      is_permanent: isPermanent,
      expires_at: isPermanent ? null : new Date(expiresAt).toISOString(),
      created_by: user.id,
    }

    let error
    if (notice?.id) {
      const { error: updateError } = await supabase.from('notices').update(payload).eq('id', notice.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('notices').insert(payload)
      error = insertError
    }

    if (error) alert('Error: ' + error.message)
    else {
      alert(notice ? 'Aviso actualizado' : 'Aviso creado')
      setShowForm(false)
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este aviso?')) return
    const { error } = await supabase.from('notices').delete().eq('id', notice?.id)
    if (error) alert('Error al eliminar')
    else {
      alert('Aviso eliminado')
      setShowForm(false)
      router.refresh()
    }
  }

  // ========== SI HAY UN AVISO ACTIVO ==========
  if (notice?.id) {
    if (!showForm) {
      // Vista del aviso + botón de gestionar
      return (
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(true)} className="btn btn-warning btn-sm">
              ✏️ Gestionar aviso
            </button>
          </div>
        </div>
      )
    }

    // Vista del formulario de edición
    return (
      <div style={{ marginTop: '10px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título del aviso</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Contenido</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} className="form-input" style={{ minHeight: '80px' }} />
          </div>
          <div className="form-group">
            <label className="form-label">
              <input type="checkbox" checked={isPermanent} onChange={e => setIsPermanent(e.target.checked)} />
              {' '}Permanente
            </label>
          </div>
          {!isPermanent && (
            <div className="form-group">
              <label className="form-label">Fecha de expiración</label>
              <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="form-input" />
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-success btn-sm">💾 Guardar cambios</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-sm" style={{ background: '#e5e7eb' }}>Cancelar</button>
          </div>
        </form>
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleDelete} className="btn btn-danger btn-sm">🗑️ Eliminar aviso</button>
        </div>
      </div>
    )
  }

  // ========== SIN AVISO ACTIVO (solo profesor/admin ve esto) ==========
  if (!showForm) {
    return (
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setShowForm(true)} className="btn btn-success btn-sm">
          ➕ Crear aviso
        </button>
      </div>
    )
  }

  // Formulario de creación
  return (
    <div style={{ marginTop: '10px' }}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Título del aviso</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Contenido</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="form-input" style={{ minHeight: '80px' }} />
        </div>
        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={isPermanent} onChange={e => setIsPermanent(e.target.checked)} />
            {' '}Permanente
          </label>
        </div>
        {!isPermanent && (
          <div className="form-group">
            <label className="form-label">Fecha de expiración</label>
            <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="form-input" />
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="btn btn-success btn-sm">💾 Guardar aviso</button>
          <button type="button" onClick={() => setShowForm(false)} className="btn btn-sm" style={{ background: '#e5e7eb' }}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}