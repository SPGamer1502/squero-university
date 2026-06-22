import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: course } = await supabase.from('courses').select('*, careers(name)').eq('id', params.id).single()
  const { data: assignments } = await supabase.from('assignments').select('*').eq('course_id', params.id)
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/courses" style={{ color: '#2563eb', textDecoration: 'none' }}>← Volver a cursos</Link>
      
      <div style={{ backgroundColor: '#1e40af', color: 'white', padding: '1.5rem 2rem', borderRadius: '10px', marginTop: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px' }}>📖 {course?.name}</h1>
        <p>{(course as any)?.careers?.name} | Ciclo {course?.cycle}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '22px', color: '#1e40af' }}>📝 Tareas</h2>
        {(profile?.role === 'admin' || profile?.role === 'profesor') && (
          <Link href={`/courses/${params.id}/assignments/create`} style={{
            backgroundColor: '#16a34a', color: 'white', padding: '10px 20px',
            borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold'
          }}>
            ➕ Nueva tarea
          </Link>
        )}
      </div>

      {assignments?.length === 0 && (
        <p style={{ color: '#9ca3af' }}>No hay tareas todavía.</p>
      )}

      {assignments?.map((a: any) => (
        <Link href={`/courses/${params.id}/assignments/${a.id}`} key={a.id} style={{
          backgroundColor: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '10px',
          display: 'block', textDecoration: 'none', color: 'black', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <strong>{a.title}</strong>
          <span style={{ color: '#6b7280', marginLeft: '10px' }}>
            📅 {new Date(a.due_date).toLocaleString('es-PE')}
          </span>
        </Link>
      ))}
    </div>
  )
}