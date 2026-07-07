'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function QuestionManager({ examId, questions }: { examId: number; questions: any[] }) {
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [type, setType] = useState('multiple_choice')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correct, setCorrect] = useState('')
  const [points, setPoints] = useState(1)
  const supabase = createClient()

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('exam_questions').insert({
      exam_id: examId,
      question_text: text,
      question_type: type,
      options: type === 'multiple_choice' ? options : null,
      correct_answer: correct,
      points
    })
    if (!error) {
      setText(''); setOptions(['', '', '', '']); setCorrect(''); setShowForm(false)
      window.location.reload()
    } else alert(error.message)
  }

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <div className="card-header">📋 Preguntas ({questions.length})</div>
      {questions.map((q, i) => (
        <div key={q.id} style={{ borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0' }}>
          <strong>{i + 1}. {q.question_text}</strong> ({q.points} pts)
        </div>
      ))}
      <button onClick={() => setShowForm(!showForm)} className="btn btn-sm" style={{ marginTop: '1rem' }}>
        {showForm ? 'Cerrar' : '➕ Agregar pregunta'}
      </button>
      {showForm && (
        <form onSubmit={addQuestion} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Pregunta</label>
            <input type="text" value={text} onChange={e => setText(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select value={type} onChange={e => setType(e.target.value)} className="form-select">
              <option value="multiple_choice">Opción múltiple</option>
              <option value="true_false">Verdadero/Falso</option>
              <option value="short_answer">Respuesta corta</option>
            </select>
          </div>
          {type === 'multiple_choice' && (
            <div className="form-group">
              <label className="form-label">Opciones</label>
              {options.map((opt, idx) => (
                <input key={idx} type="text" value={opt} onChange={e => {
                  const newOpts = [...options]
                  newOpts[idx] = e.target.value
                  setOptions(newOpts)
                }} className="form-input" placeholder={`Opción ${idx + 1}`} style={{ marginBottom: '4px' }} />
              ))}
              <label className="form-label">Respuesta correcta (índice 0-3)</label>
              <input type="text" value={correct} onChange={e => setCorrect(e.target.value)} className="form-input" placeholder="0,1,2 o 3" />
            </div>
          )}
          {type === 'true_false' && (
            <div className="form-group">
              <label className="form-label">Respuesta correcta</label>
              <select value={correct} onChange={e => setCorrect(e.target.value)} className="form-select">
                <option value="true">Verdadero</option>
                <option value="false">Falso</option>
              </select>
            </div>
          )}
          {type === 'short_answer' && (
            <div className="form-group">
              <label className="form-label">Respuesta correcta</label>
              <input type="text" value={correct} onChange={e => setCorrect(e.target.value)} className="form-input" required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Puntos</label>
            <input type="number" value={points} onChange={e => setPoints(parseInt(e.target.value))} className="form-input" required />
          </div>
          <button type="submit" className="btn btn-success btn-sm">💾 Guardar pregunta</button>
        </form>
      )}
    </div>
  )
}