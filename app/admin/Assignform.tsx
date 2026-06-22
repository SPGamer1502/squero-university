'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AssignForm({ students, careers }: { students: any[], careers: any[] }) {
  const [studentId, setStudentId] = useState('')
  const [careerId, setCareerId] = useState('')
  const [cycle, setCycle] = useState('1')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('admin_assignments').insert({
      admin_id: user.id,
      student_id: studentId,
      career_id: parseInt(careerId),
      cycle: parseInt(cycle)
    })

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('✅ Alumno asignado correctamente. Ya puede ver sus cursos.')
      setStudentId('')
      setCareerId('')
      setCycle('1')
      router.refresh()
    }
    setLoading(false)
  }

  const unassignedStudents = students.filter((s: any) => !s.approved)

  return (
    <form onSubmit={handleAssign}>
      {message !== '' && (
        <div className={message.includes('✅') ? 'alert alert-success' : 'alert alert-error'}>{message}</div>
      )}
      
      <div className="form-group">
        <label className="form-label">Alumno</label>
        <select value={studentId} onChange={e => setStudentId(e.target.value)} className="form-select" required>
          <option value="">Seleccionar alumno...</option>
          {unassignedStudents.map((s: any) => (
            <option key={s.id} value={s.id}>{s.full_name}</option>
          ))}
        </select>
        {unassignedStudents.length === 0 && (
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>No hay alumnos pendientes de asignación.</p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Carrera</label>
        <select value={careerId} onChange={e => setCareerId(e.target.value)} className="form-select" required>
          <option value="">Seleccionar carrera...</option>
          {careers.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Ciclo</label>
        <select value={cycle} onChange={e => setCycle(e.target.value)} className="form-select" required>
          <option value="1">Ciclo I</option>
          <option value="2">Ciclo II</option>
        </select>
      </div>

      <button type="submit" disabled={loading} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
        {loading ? 'Asignando...' : '📋 Asignar carrera y ciclo'}
      </button>
    </form>
  )
}