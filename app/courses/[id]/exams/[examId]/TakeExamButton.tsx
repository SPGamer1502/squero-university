'use client'
import { useRouter } from 'next/navigation'

export default function TakeExamButton({ examId, courseId }: { examId: number; courseId: number }) {
  const router = useRouter()
  return (
    <button onClick={() => router.push(`/courses/${courseId}/exams/${examId}/take`)} className="btn btn-primary" style={{ marginTop: '1rem' }}>
      🚀 Comenzar examen
    </button>
  )
}