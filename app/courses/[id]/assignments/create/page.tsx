'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateAssignmentPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let fileUrl = ''
    
    if (file) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assignment-files')
        .upload(`${params.id}/${Date.now()}-${file.name}`, file)
      if (uploadError) { alert(uploadError.message); return }
      fileUrl = uploadData?.path || ''
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('assignments').insert({
      course_id: parseInt(params.id),
      title,
      description,
      due_date: new Date(dueDate).toISOString(),
      file_url: fileUrl,
      created_by: user.id
    })

    if (!error) {
      alert('Tarea creada con éxito')
      router.push(`/courses/${params.id}`)
    } else {
      alert('Error: ' + error.message)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '1.5rem', color: '#1e40af' }}>📝 Nueva tarea</h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Título</label>
        <input placeholder="Ej: Trabajo de investigación" value={title} onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        
        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Descripción</label>
        <textarea placeholder="Instrucciones de la tarea" value={description} onChange={e => setDescription(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '80px' }} />
        
        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Fecha límite</label>
        <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        
        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Archivo adjunto (opcional)</label>
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', marginTop: '4px' }} />
        
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          Crear tarea
        </button>
      </form>
    </div>
  )
}