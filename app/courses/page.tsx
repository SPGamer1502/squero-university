import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single()

  let courses: any[] = []

  if (profile?.role === 'admin' || profile?.role === 'profesor') {
    // Admin y profesor ven todos los cursos
    const { data } = await supabase.from('courses').select('*, careers(name)').order('career_id').order('cycle')
    courses = data || []
  } else if (profile?.role === 'alumno' && profile?.career_id) {
    // Alumno SOLO ve los cursos de su carrera y ciclo
    const { data } = await supabase.from('courses')
      .select('*, careers(name)')
      .eq('career_id', profile.career_id)
      .eq('cycle', profile.cycle)
      .order('name')
    courses = data || []
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/dashboard" style={{ color: '#2563eb', textDecoration: 'none' }}>← Volver al inicio</Link>
      <h1 style={{ fontSize: '26px', marginTop: '1rem', marginBottom: '1.5rem', color: '#1e40af' }}>
        {profile?.role === 'alumno' ? '📚 Mis cursos' : '📚 Todos los cursos'}
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {courses.map((course: any) => (
          <div key={course.id} style={{
            backgroundColor: 'white', padding: '1rem 1.5rem', borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <strong>{course.name}</strong>
              <span style={{ color: '#6b7280', marginLeft: '10px' }}>{course.code}</span>
              <p style={{ color: '#9ca3af', margin: '4px 0 0 0', fontSize: '13px' }}>
                {course.careers?.name} | Ciclo {course.cycle}
              </p>
            </div>
            <Link href={`/courses/${course.id}`} style={{
              backgroundColor: '#2563eb', color: 'white', padding: '8px 16px',
              borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold'
            }}>
              Ver curso
            </Link>
          </div>
        ))}
        {courses.length === 0 && (
          <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No tienes cursos asignados.</p>
        )}
      </div>
    </div>
  )
}