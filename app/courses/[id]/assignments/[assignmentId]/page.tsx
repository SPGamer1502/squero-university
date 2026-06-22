import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import SubmissionForm from './submissionForm'

export default async function AssignmentPage({ params }: { params: { id: string; assignmentId: string } }) {
  const supabase = await createClient()
  const { data: assignment } = await supabase.from('assignments').select('*').eq('id', params.assignmentId).single()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  const { data: submission } = await supabase.from('submissions')
    .select('*').eq('assignment_id', params.assignmentId).eq('user_id', user?.id).maybeSingle()

  const fileUrl = assignment?.file_url 
    ? supabase.storage.from('assignment-files').getPublicUrl(assignment.file_url).data.publicUrl 
    : null

  const submissionUrl = submission?.file_url
    ? supabase.storage.from('submissions').getPublicUrl(submission.file_url).data.publicUrl
    : null

  const isLate = assignment ? new Date() > new Date(assignment.due_date) : false

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href={`/courses/${params.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>← Volver al curso</Link>
      
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', marginTop: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '26px', color: '#1e40af' }}>📝 {assignment?.title}</h1>
        <p style={{ color: '#6b7280', margin: '10px 0' }}>{assignment?.description}</p>
        <p><strong>📅 Fecha límite:</strong> {new Date(assignment?.due_date).toLocaleString('es-PE')}</p>
        {isLate && <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Tarea vencida</p>}
        {(profile?.role === 'admin' || profile?.role === 'profesor') && (
  <Link href={`/courses/${params.id}/assignments/${params.assignmentId}/submissions`} style={{
    display: 'inline-block', marginTop: '10px', backgroundColor: '#8b5cf6', color: 'white',
    padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold'
  }}>
    📋 Ver entregas de alumnos
  </Link>
)}
        {fileUrl && (
          <a href={fileUrl} target="_blank" style={{ color: '#2563eb', fontWeight: 'bold' }}>📎 Ver archivo adjunto del profesor</a>
        )}
      </div>

      {/* Si es alumno y no ha entregado y no está vencida */}
      {profile?.role === 'alumno' && !submission && !isLate && (
        <div style={{ marginTop: '1.5rem' }}>
          <SubmissionForm assignmentId={params.assignmentId} />
        </div>
      )}

      {/* Si ya entregó */}
      {submission && (
        <div style={{ backgroundColor: '#dcfce7', padding: '1.5rem', borderRadius: '10px', marginTop: '1.5rem' }}>
          <h3 style={{ color: '#166534' }}>✅ Ya entregaste tu tarea</h3>
          {submissionUrl && <a href={submissionUrl} target="_blank" style={{ color: '#2563eb' }}>📎 Ver mi entrega</a>}
          <p>📅 Entregado: {new Date(submission.submitted_at).toLocaleString('es-PE')}</p>
          {submission.grade !== null && <p><strong>🎯 Nota:</strong> {submission.grade}/10</p>}
          {submission.feedback && <p><strong>💬 Comentario:</strong> {submission.feedback}</p>}
        </div>
      )}

      {/* Si no entregó y ya venció */}
      {!submission && isLate && profile?.role === 'alumno' && (
        <div style={{ backgroundColor: '#fee2e2', padding: '1.5rem', borderRadius: '10px', marginTop: '1.5rem' }}>
          <p style={{ color: '#991b1b' }}>❌ No entregaste a tiempo. La fecha límite ya pasó.</p>
        </div>
      )}
    </div>
  )
}