'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ExamForm({ courseId }: { courseId: number }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLimit, setTimeLimit] = useState(30)
  const [maxAttempts, setMaxAttempts] = useState(1)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', question_type: 'multiple_choice', options: ['', '', '', ''], correct_answer: '', points: 1 }])
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index][field] = value
    setQuestions(updated)
  }

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[optIndex] = value
    setQuestions(updated)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (questions.length === 0) {
      alert('Agrega al menos una pregunta')
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Crear examen
    const { data: exam, error: examError } = await supabase.from('exams').insert({
      course_id: courseId,
      title,
      description,
      time_limit_minutes: timeLimit,
      max_attempts: maxAttempts,
      created_by: user.id
    }).select('id').single()

    if (examError || !exam) {
      alert('Error al crear examen: ' + examError?.message)
      setLoading(false)
      return
    }

    // 2. Insertar preguntas
    const questionsToInsert = questions.map(q => ({
      exam_id: exam.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.question_type === 'multiple_choice' ? q.options : null,
      correct_answer: q.correct_answer.toString(),
      points: q.points
    }))

    const { error: questionsError } = await supabase.from('exam_questions').insert(questionsToInsert)
    if (questionsError) {
      alert('Error al guardar preguntas: ' + questionsError.message)
    } else {
      alert('Examen creado con éxito')
      router.push(`/courses/${courseId}/exams`)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem' }}>
      <div className="form-group">
        <label className="form-label">Título del examen</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input" required />
      </div>
      <div className="form-group">
        <label className="form-label">Descripción</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-input" />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Límite de tiempo (minutos)</label>
          <input type="number" value={timeLimit} onChange={e => setTimeLimit(parseInt(e.target.value))} className="form-input" min={1} required />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Máximo de intentos</label>
          <input type="number" value={maxAttempts} onChange={e => setMaxAttempts(parseInt(e.target.value))} className="form-input" min={1} required />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '0.5rem' }}>Preguntas</h3>
        {questions.map((q, index) => (
          <div key={index} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Pregunta {index + 1}</strong>
              <button type="button" onClick={() => removeQuestion(index)} className="btn btn-danger btn-sm">🗑️</button>
            </div>
            <input type="text" value={q.question_text} onChange={e => updateQuestion(index, 'question_text', e.target.value)} placeholder="Texto de la pregunta" className="form-input" style={{ marginBottom: '0.5rem' }} required />
            <select value={q.question_type} onChange={e => updateQuestion(index, 'question_type', e.target.value)} className="form-select" style={{ marginBottom: '0.5rem' }}>
              <option value="multiple_choice">Opción múltiple</option>
              <option value="true_false">Verdadero/Falso</option>
              <option value="short_answer">Respuesta corta</option>
            </select>
            {q.question_type === 'multiple_choice' && (
              <div style={{ marginBottom: '0.5rem' }}>
                {q.options.map((opt: string, optIdx: number) => (
                  <input key={optIdx} type="text" value={opt} onChange={e => updateOption(index, optIdx, e.target.value)} placeholder={`Opción ${optIdx + 1}`} className="form-input" style={{ marginBottom: '0.25rem' }} />
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Respuesta correcta</label>
                {q.question_type === 'multiple_choice' ? (
                  <select value={q.correct_answer} onChange={e => updateQuestion(index, 'correct_answer', e.target.value)} className="form-select">
                    <option value="">Seleccionar</option>
                    {q.options.map((opt: string, i: number) => (
                      <option key={i} value={i.toString()}>{opt || `Opción ${i+1}`}</option>
                    ))}
                  </select>
                ) : q.question_type === 'true_false' ? (
                  <select value={q.correct_answer} onChange={e => updateQuestion(index, 'correct_answer', e.target.value)} className="form-select">
                    <option value="true">Verdadero</option>
                    <option value="false">Falso</option>
                  </select>
                ) : (
                  <input type="text" value={q.correct_answer} onChange={e => updateQuestion(index, 'correct_answer', e.target.value)} placeholder="Respuesta esperada" className="form-input" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Puntos</label>
                <input type="number" value={q.points} onChange={e => updateQuestion(index, 'points', parseInt(e.target.value))} className="form-input" min={1} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="btn btn-outline btn-sm">➕ Agregar pregunta</button>
      </div>

      <button type="submit" disabled={loading} className="btn btn-success" style={{ marginTop: '1rem', width: '100%' }}>
        {loading ? 'Guardando...' : '💾 Guardar examen'}
      </button>
    </form>
  )
}