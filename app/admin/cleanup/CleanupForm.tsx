'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

type Scope = 'all' | 'career' | 'cycle' | 'course'

interface Props {
  careers: { id: number; name: string }[]
  courses: { id: number; name: string; code: string; career_id: number; cycle: number }[]
}

export default function CleanupForm({ careers, courses }: Props) {
  const [scope, setScope] = useState<Scope>('all')
  const [careerId, setCareerId] = useState('')
  const [cycle, setCycle] = useState('1')
  const [courseId, setCourseId] = useState('')
  const [status, setStatus] = useState<'idle' | 'confirm' | 'deleting' | 'done'>('idle')
  const [affected, setAffected] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  // Filtrar cursos por carrera para el selector de curso
  const filteredCourses = careerId
    ? courses.filter(c => c.career_id === parseInt(careerId))
    : courses

  // Cuenta cuántos archivos/registros serán afectados
  const checkAffected = async () => {
    let query = supabase.from('submissions').select('id', { count: 'exact', head: true })

    if (scope === 'career' && careerId) {
      const { data: courseIds } = await supabase.from('courses').select('id').eq('career_id', parseInt(careerId))
      const ids = courseIds?.map(c => c.id) || []
      if (ids.length === 0) return 0
      const { data: assignmentIds } = await supabase.from('assignments').select('id').in('course_id', ids)
      const assignmentIdsArr = assignmentIds?.map(a => a.id) || []
      if (assignmentIdsArr.length === 0) return 0
      query = query.in('assignment_id', assignmentIdsArr)
    } else if (scope === 'cycle') {
      const { data: courseIds } = await supabase.from('courses').select('id').eq('cycle', parseInt(cycle))
      const ids = courseIds?.map(c => c.id) || []
      if (ids.length === 0) return 0
      const { data: assignmentIds } = await supabase.from('assignments').select('id').in('course_id', ids)
      const assignmentIdsArr = assignmentIds?.map(a => a.id) || []
      if (assignmentIdsArr.length === 0) return 0
      query = query.in('assignment_id', assignmentIdsArr)
    } else if (scope === 'course' && courseId) {
      const { data: assignmentIds } = await supabase.from('assignments').select('id').eq('course_id', parseInt(courseId))
      const assignmentIdsArr = assignmentIds?.map(a => a.id) || []
      if (assignmentIdsArr.length === 0) return 0
      query = query.in('assignment_id', assignmentIdsArr)
    }

    const { count, error } = await query
    if (error) return 0
    return count || 0
  }

  const handleProceed = async () => {
    const count = await checkAffected()
    setAffected(count)
    setStatus('confirm')
  }

  const handleDelete = async () => {
    setStatus('deleting')
    try {
      // 1. Obtener los file_url de las submissions afectadas
      let query = supabase.from('submissions').select('id, file_url')

      if (scope === 'career' && careerId) {
        const { data: courseIds } = await supabase.from('courses').select('id').eq('career_id', parseInt(careerId))
        const ids = courseIds?.map(c => c.id) || []
        const { data: assignmentIds } = await supabase.from('assignments').select('id').in('course_id', ids)
        const assignmentIdsArr = assignmentIds?.map(a => a.id) || []
        if (assignmentIdsArr.length === 0) { setStatus('done'); return }
        query = query.in('assignment_id', assignmentIdsArr)
      } else if (scope === 'cycle') {
        const { data: courseIds } = await supabase.from('courses').select('id').eq('cycle', parseInt(cycle))
        const ids = courseIds?.map(c => c.id) || []
        const { data: assignmentIds } = await supabase.from('assignments').select('id').in('course_id', ids)
        const assignmentIdsArr = assignmentIds?.map(a => a.id) || []
        if (assignmentIdsArr.length === 0) { setStatus('done'); return }
        query = query.in('assignment_id', assignmentIdsArr)
      } else if (scope === 'course' && courseId) {
        const { data: assignmentIds } = await supabase.from('assignments').select('id').eq('course_id', parseInt(courseId))
        const assignmentIdsArr = assignmentIds?.map(a => a.id) || []
        if (assignmentIdsArr.length === 0) { setStatus('done'); return }
        query = query.in('assignment_id', assignmentIdsArr)
      }

      const { data: submissions } = await query
      if (!submissions || submissions.length === 0) {
        setStatus('done')
        return
      }

      // 2. Eliminar archivos del storage
      const paths = submissions.map(s => s.file_url).filter(Boolean)
      if (paths.length > 0) {
        // Supabase permite borrar hasta 1000 archivos por llamada
        for (let i = 0; i < paths.length; i += 1000) {
          const batch = paths.slice(i, i + 1000)
          await supabase.storage.from('submissions').remove(batch)
        }
      }

      // 3. Eliminar registros de la base de datos
      const submissionIds = submissions.map(s => s.id)
      await supabase.from('submissions').delete().in('id', submissionIds)

      setStatus('done')
      router.refresh()
    } catch (err) {
      alert('Error durante la limpieza. Revisa la consola.')
      console.error(err)
      setStatus('idle')
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ color: '#b91c1c', marginBottom: '1rem' }}>🗑️ Eliminar entregas de alumnos</h2>
      
      <div className="form-group">
        <label className="form-label">Alcance de la limpieza</label>
        <select value={scope} onChange={e => { setScope(e.target.value as Scope); setStatus('idle') }} className="form-select">
          <option value="all">Todos los archivos (completo)</option>
          <option value="career">Por carrera</option>
          <option value="cycle">Por ciclo</option>
          <option value="course">Por curso</option>
        </select>
      </div>

      {scope === 'career' && (
        <div className="form-group">
          <label className="form-label">Carrera</label>
          <select value={careerId} onChange={e => setCareerId(e.target.value)} className="form-select">
            <option value="">Seleccionar carrera...</option>
            {careers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {scope === 'cycle' && (
        <div className="form-group">
          <label className="form-label">Ciclo</label>
          <select value={cycle} onChange={e => setCycle(e.target.value)} className="form-select">
            <option value="1">Ciclo I</option>
            <option value="2">Ciclo II</option>
          </select>
        </div>
      )}

      {scope === 'course' && (
        <div className="form-group">
          <label className="form-label">Curso</label>
          <select value={courseId} onChange={e => setCourseId(e.target.value)} className="form-select">
            <option value="">Seleccionar curso...</option>
            {filteredCourses.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
            ))}
          </select>
        </div>
      )}

      {status === 'idle' && (
        <button onClick={handleProceed} className="btn btn-danger" style={{ marginTop: '1rem' }}>
          🔍 Verificar archivos a eliminar
        </button>
      )}

      {status === 'confirm' && (
        <div style={{ marginTop: '1rem', background: '#fee2e2', padding: '1rem', borderRadius: '8px' }}>
          <p style={{ fontWeight: 'bold', color: '#b91c1c' }}>
            ⚠️ Se eliminarán {affected} archivos/registros. Esta acción no se puede deshacer.
          </p>
          <button onClick={handleDelete} className="btn btn-danger" style={{ marginRight: '0.5rem' }}>
            🗑️ Confirmar eliminación
          </button>
          <button onClick={() => setStatus('idle')} className="btn btn-sm" style={{ background: '#e5e7eb' }}>
            Cancelar
          </button>
        </div>
      )}

      {status === 'deleting' && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7' }}>
          <p>⏳ Eliminando archivos... Esto puede tardar unos segundos.</p>
        </div>
      )}

      {status === 'done' && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#dcfce7' }}>
          <p>✅ Limpieza completada exitosamente.</p>
          <button onClick={() => { setStatus('idle'); router.refresh() }} className="btn btn-sm" style={{ marginRight: '0.5rem' }}>
            Nueva limpieza
          </button>
          <Link href="/admin" className="btn btn-sm">Volver al panel</Link>
        </div>
      )}
    </div>
  )
}