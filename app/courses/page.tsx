import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single()

  let courses: any[] = []

  if (profile?.role === 'admin' || profile?.role === 'profesor') {
    const { data } = await supabase.from('courses').select('*, careers(name)').order('career_id').order('cycle')
    courses = data || []
  } else if (profile?.role === 'alumno' && profile?.career_id && profile?.cycle) {
    const { data } = await supabase.from('courses')
      .select('*, careers(name)')
      .eq('career_id', profile.career_id)
      .eq('cycle', profile.cycle)
      .order('name')
    courses = data || []
  }

  // Eliminar duplicados por ID
  const uniqueCourses = Array.from(
    new Map(courses.map(course => [course.id, course])).values()
  )

  // Obtener cursos con avisos activos
  const { data: coursesWithNotices } = await supabase
    .from('notices')
    .select('course_id')
    .or('is_permanent.eq.true,expires_at.gte.now()')

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <a href="/dashboard" className="navbar-brand" style={{ textDecoration: 'none' }}>
            <div className="navbar-brand-icon">🎓</div>
            <div>
              <div className="navbar-brand-text">SqueroUniversity</div>
              <div className="navbar-brand-subtext">SqueroU</div>
            </div>
          </a>
        </div>
        <div className="navbar-user">
          <form action="/auth/logout" method="post">
            <button type="submit" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              🚪 Salir
            </button>
          </form>
        </div>
      </nav>

      <div className="container">
        <Link href="/dashboard" className="link" style={{ display: 'inline-block', marginBottom: '1rem' }}>← Volver al inicio</Link>
        
        <div className="page-header">
          <h1>{profile?.role === 'alumno' ? '📚 Mis Cursos' : '📚 Todos los Cursos'}</h1>
          <p>{profile?.role === 'alumno' ? `${profile?.careers?.name} · Ciclo ${profile?.cycle} · ${uniqueCourses.length} cursos` : 'Catálogo completo'}</p>
        </div>

        <div className="grid" style={{ gap: '0.75rem' }}>
          {uniqueCourses.map((course: any) => (
            <Link href={`/courses/${course.id}`} key={course.id} className="course-item" style={{ textDecoration: 'none', position: 'relative' }}>
              <div>
                <strong style={{ fontSize: '16px', color: '#1f2937' }}>{course.name}</strong>
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: '2px 0 0 0' }}>
                  {course.careers?.name} · Ciclo {course.cycle}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="course-item-code">{course.code}</span>
                {coursesWithNotices?.some(n => n.course_id === course.id) && (
                  <span style={{ color: 'red', fontSize: '20px' }}>🔴</span>
                )}
                <span className="badge badge-primary">Ver curso</span>
              </div>
            </Link>
          ))}
          {uniqueCourses.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>No tienes cursos asignados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}