'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateCoursePage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('courses').insert({ name, description, created_by: user.id })
    if (!error) router.push('/courses')
    else alert(error.message)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '1.5rem' }}>Crear nuevo curso</h1>
      <form onSubmit={handleCreate} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px' }}>
        <input placeholder="Nombre del curso" value={name} onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        <textarea placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Crear curso
        </button>
      </form>
    </div>
  )
}