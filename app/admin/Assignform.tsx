'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AssignForm({ students, careers }: { students: any[], careers: any[] }) {
  const [studentId, setStudentId] = useState('')
  const [careerId, setCareerId] = useState('')
  const [cycle, setCycle] = useState('1')
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
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
      setMessage('❌ Error: ' + error.message)
    } else {
      setMessage('✅ Alumno asignado correctamente. Ya puede ver sus cursos.')
      setStudentId('')
      setCareerId('')
      setCycle('1')
      router.refresh()
    }
  }

  const unassignedStudents = students.filter(s => !s.approved)

  return (
    <form onSubmit={handleAssign}>
      {message && <p style={{ marginBottom: '1rem', padding: '10px', borderRadius: '6px', backgroundColor: message.includes('✅') ? '#dcfce7' : '#fee2e2' }}>{message}</p>}
      
      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Alumno</label>
      <select value={studentId} onChange={e => setStudentId(e.target.value)} required
        style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
        <option value="">Seleccionar alumno...</option>
        {unassignedStudents.map(s => (
          <option key={s.id} value={s.id}>{s.full_name} ({s.email || 'sin correo'})</option>
        ))}
      </select>

      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Carrera</label>
      <select value={careerId} onChange={e => setCareerId(e.target.value)} required
        style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
        <option value="">Seleccionar carrera...</option>
        {careers.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Ciclo</label>
      <select value={cycle} onChange={e => setCycle(e.target.value)} required
        style={{ width: '100%', padding: '10px', marginBottom: '20px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
        <option value="1">Ciclo I</option>
        <option value="2">Ciclo II</option>
      </select>

      <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#991b1b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
        Asignar carrera y ciclo
      </button>
    </form>
  )
}