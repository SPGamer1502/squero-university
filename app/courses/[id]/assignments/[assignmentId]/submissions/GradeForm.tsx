'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GradeForm({
  submissionId,
  currentGrade,
  currentFeedback,
}: {
  submissionId: number
  currentGrade: number | null
  currentFeedback: string | null
}) {
  const [grade, setGrade] = useState(currentGrade?.toString() || '')
  const [feedback, setFeedback] = useState(currentFeedback || '')
  const [saved, setSaved] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSave = async () => {
    const numericGrade = parseFloat(grade)
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 20) {
      alert('La nota debe estar entre 0 y 20.')
      return
    }

    const { error } = await supabase
      .from('submissions')
      .update({
        grade: numericGrade,
        feedback: feedback,
      })
      .eq('id', submissionId)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    }
  }

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
      <label style={{ fontWeight: 'bold', fontSize: '14px' }}>🎯 Nota (0-20)</label>
      <input
        type="number"
        min="0"
        max="20"
        step="0.1"
        value={grade}
        onChange={e => setGrade(e.target.value)}
        style={{
          width: '80px',
          padding: '8px',
          margin: '8px 0',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          display: 'block',
        }}
      />

      <label style={{ fontWeight: 'bold', fontSize: '14px' }}>💬 Comentario</label>
      <textarea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder="Retroalimentación para el alumno..."
        style={{
          width: '100%',
          padding: '8px',
          margin: '8px 0',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          minHeight: '60px',
        }}
      />

      <button
        onClick={handleSave}
        style={{
          backgroundColor: saved ? '#16a34a' : '#2563eb',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {saved ? '✅ Guardado' : '💾 Guardar calificación'}
      </button>
    </div>
  )
}