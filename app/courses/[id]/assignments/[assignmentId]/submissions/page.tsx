import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import GradeForm from './GradeForm'

export default async function SubmissionsPage({ params }: { params: { id: string; assignmentId: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  const { data: assignment } = await supabase.from('assignments').select('*').eq('id', params.assignmentId).single()
  const { data: submissions } = await supabase.from('submissions')
    .select('*, profiles(full_name)')
    .eq('assignment_id', params.assignmentId)
    .order('submitted_at', { ascending: false })

  if (profile?.role === 'alumno') {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><p>Solo profesores y admin pueden ver esta página.</p></div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href={`/courses/${params.id}/assignments/${params.assignmentId}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
        ← Volver a la tarea
      </Link>

      <h1 style={{ fontSize: '24px', marginTop: '1rem', color: '#1e40af' }}>📋 Entregas: {assignment?.title}</h1>
      <p style={{ color: '#6b7280' }}>Total de entregas: {submissions?.length || 0}</p>

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {submissions?.map((sub: any) => {
          const fileUrl = supabase.storage.from('submissions').getPublicUrl(sub.file_url).data.publicUrl
          return (
            <div key={sub.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '18px' }}>👤 {sub.profiles?.full_name}</strong>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  📅 {new Date(sub.submitted_at).toLocaleString('es-PE')}
                </span>
              </div>
              <a href={fileUrl} target="_blank" style={{ color: '#2563eb', fontWeight: 'bold' }}>
                📎 Ver archivo entregado
              </a>
              <GradeForm submissionId={sub.id} currentGrade={sub.grade} currentFeedback={sub.feedback} />
            </div>
          )
        })}
        {submissions?.length === 0 && (
          <p style={{ color: '#9ca3af', textAlign: 'center' }}>No hay entregas todavía.</p>
        )}
      </div>
    </div>
  )
}