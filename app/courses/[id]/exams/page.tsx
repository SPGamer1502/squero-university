import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function ExamsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .eq('course_id', id)
    .order('created_at', { ascending: false })

  const courseId = parseInt(id)

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <Link href={`/courses/${id}`} className="link">← Volver al curso</Link>
      <div className="page-header">
        <h1>📝 Exámenes del curso</h1>
        {(profile?.role === 'admin' || profile?.role === 'profesor') && (
          <Link href={`/courses/${id}/exams/create`} className="btn btn-success">➕ Crear examen</Link>
        )}
      </div>

      <div className="grid" style={{ gap: '1rem', marginTop: '1rem' }}>
        {exams?.map(exam => (
          <div key={exam.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{exam.title}</strong>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                ⏱️ {exam.time_limit_minutes} min | 🔁 {exam.max_attempts} intentos
              </p>
            </div>
            <Link href={`/courses/${courseId}/exams/${exam.id}`} className="btn btn-primary btn-sm">
              {profile?.role === 'alumno' ? 'Tomar examen' : 'Ver examen'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}