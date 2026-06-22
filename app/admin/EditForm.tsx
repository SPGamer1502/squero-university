'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EditFormProps {
  assignmentId: number
  studentId: string
  currentCareerId: number
  currentCycle: number
  careers: any[]
}

export default function EditForm({ assignmentId, studentId, currentCareerId, currentCycle, careers }: EditFormProps) {
  const [careerId, setCareerId] = useState(currentCareerId.toString())
  const [cycle, setCycle] = useState(currentCycle.toString())
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // 1. Actualizar la asignación
    await supabase.from('admin_assignments').update({
      career_id: parseInt(careerId),
      cycle: parseInt(cycle)
    }).eq('id', assignmentId)

    // 2. Actualizar el perfil del alumno
    await supabase.from('profiles').update({
      career_id: parseInt(careerId),
      cycle: parseInt(cycle)
    }).eq('id', studentId)

    // 3. Eliminar inscripciones antiguas
    await supabase.from('enrollments').delete().eq('user_id', studentId)

    // 4. Inscribir en los nuevos cursos
    const { data: newCourses } = await supabase.from('courses').select('id').eq('career_id', parseInt(careerId)).eq('cycle', parseInt(cycle))
    if (newCourses) {
      const enrollments = newCourses.map(c => ({ user_id: studentId, course_id: c.id }))
      await supabase.from('enrollments').insert(enrollments)
    }

    setLoading(false)
    setShowForm(false)
    alert('✅ Alumno reasignado correctamente')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('¿Seguro que quieres eliminar esta asignación? El alumno se quedará sin cursos.')) return
    
    await supabase.from('enrollments').delete().eq('user_id', studentId)
    await supabase.from('profiles').update({ career_id: null, cycle: null, approved: false }).eq('id', studentId)
    await supabase.from('admin_assignments').delete().eq('id', assignmentId)
    
    alert('✅ Asignación eliminada')
    router.refresh()
  }

  return (
    <div>
      {!showForm && (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setShowForm(true)} className="btn btn-warning btn-sm">
            ✏️ Editar
          </button>
          <button onClick={handleDelete} className="btn btn-danger btn-sm">
            🗑️ Eliminar
          </button>
        </div>
      )}

      {showForm && (
        <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', width: '100%' }}>
          <form onSubmit={handleEdit}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={careerId} onChange={e => setCareerId(e.target.value)} className="form-select" style={{ width: '200px' }}>
                {careers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select value={cycle} onChange={e => setCycle(e.target.value)} className="form-select" style={{ width: '100px' }}>
                <option value="1">Ciclo I</option>
                <option value="2">Ciclo II</option>
              </select>
              <button type="submit" disabled={loading} className="btn btn-success btn-sm">
                {loading ? '...' : '💾 Guardar'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-sm" style={{ background: '#e5e7eb' }}>
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}