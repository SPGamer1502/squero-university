import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import TakeExamButton from './TakeExamButton'
import QuestionManager from './QuestionManager'

export default async function ExamDetailPage({ params }: { params: Promise<{ id: string; examId: string }> }) {
  const { id, examId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  const { data: exam } = await supabase.from('exams').select('*').eq('id', examId).single()
  const { data: questions } = await supabase.from('exam_questions').select('*').eq('exam_id', examId).order('id')
  const { data: attempts } = await supabase.from('exam_attempts').select('*').eq('exam_id', examId).eq('user_id', user?.id)

  const remainingAttempts = exam ? exam.max_attempts - (attempts?.length || 0) : 0

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <Link href={`/courses/${id}/exams`} className="link">← Volver a exámenes</Link>
      <div className="page-header">
        <h1>📝 {exam?.title}</h1>
        <p>{exam?.description}</p>
        <p>⏱️ {exam?.time_limit_minutes} minutos | 🔁 {exam?.max_attempts} intentos | Intentos usados: {attempts?.length || 0}</p>
      </div>

      {(profile?.role === 'admin' || profile?.role === 'profesor') && (
        <QuestionManager examId={parseInt(examId)} questions={questions || []} />
      )}

      {profile?.role === 'alumno' && remainingAttempts > 0 && (
        <TakeExamButton examId={parseInt(examId)} courseId={parseInt(id)} />
      )}
      {profile?.role === 'alumno' && remainingAttempts <= 0 && (
        <p style={{ color: '#b91c1c' }}>Has agotado tus intentos para este examen.</p>
      )}
    </div>
  )
}