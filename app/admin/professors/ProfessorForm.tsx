'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProfessorFormProps {
  assignmentId?: number
  professorId?: string
  currentCourseId?: number
  professors?: any[]
  courses: any[]
  mode: 'create' | 'edit'
}

export default function ProfessorForm({ assignmentId, professorId, currentCourseId, professors, courses, mode }: ProfessorFormProps) {
  const [selectedProfessor, setSelectedProfessor] = useState(professorId || '')
  const [selectedCourse, setSelectedCourse] = useState(currentCourseId?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    if (mode === 'create') {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('professor_assignments').insert({
        admin_id: user?.id,
        professor_id: selectedProfessor,
        course_id: parseInt(selectedCourse)
      })
      if (error) {
        alert('Error: ' + error.message)
      } else {
        // ✅ ACTUALIZAR APROBADO A TRUE
        await supabase.from('profiles').update({ approved: true }).eq('id', selectedProfessor)
        alert('✅ Profesor asignado al curso')
        setSelectedProfessor('')
        setSelectedCourse('')
        router.refresh()
      }
    }

    if (mode === 'edit') {
      const { error } = await supabase.from('professor_assignments')
        .update({ course_id: parseInt(selectedCourse) })
        .eq('id', assignmentId)
      if (error) alert('Error: ' + error.message)
      else {
        alert('✅ Curso actualizado')
        setShowEdit(false)
        router.refresh()
      }
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta asignación?')) return
    // Quitar aprobación al eliminar
    await supabase.from('profiles').update({ approved: false }).eq('id', professorId)
    await supabase.from('professor_assignments').delete().eq('id', assignmentId)
    alert('✅ Asignación eliminada')
    router.refresh()
  }

  if (mode === 'edit' && !showEdit) {
    return (
      <div style={{ display: 'flex', gap: '6px' }}>
        <button onClick={() => {
          setShowEdit(true)
          setSelectedCourse(currentCourseId?.toString() || '')
        }} className="btn btn-warning btn-sm">✏️ Mover</button>
        <button onClick={handleDelete} className="btn btn-danger btn-sm">🗑️</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {mode === 'create' && (
        <div className="form-group">
          <label className="form-label">Profesor</label>
          <select value={selectedProfessor} onChange={e => setSelectedProfessor(e.target.value)} className="form-select" required>
            <option value="">Seleccionar profesor...</option>
            {professors?.map((p: any) => (
              <option key={p.id} value={p.id}>{p.full_name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Curso</label>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="form-select" required>
          <option value="">Seleccionar curso...</option>
          {courses.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name} ({c.code}) - {c.careers?.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="submit" disabled={loading} className="btn btn-success btn-sm" style={{ flex: 1 }}>
          {loading ? '⏳' : mode === 'create' ? '📋 Asignar' : '💾 Guardar'}
        </button>
        {mode === 'edit' && (
          <button type="button" onClick={() => setShowEdit(false)} className="btn btn-sm" style={{ background: '#e5e7eb' }}>
            ❌
          </button>
        )}
      </div>
    </form>
  )
}