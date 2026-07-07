import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import ExamForm from './ExamForm'

export default async function CreateExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  if (!user || (profile?.role !== 'admin' && profile?.role !== 'profesor')) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Acceso denegado.</p>
        <Link href={`/courses/${id}`}>Volver al curso</Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <Link href={`/courses/${id}/exams`} className="link">← Volver a exámenes</Link>
      <div className="page-header">
        <h1>➕ Crear nuevo examen</h1>
      </div>
      <ExamForm courseId={parseInt(id)} />
    </div>
  )
}