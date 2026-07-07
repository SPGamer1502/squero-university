import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function CareerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: career } = await supabase
    .from('careers')
    .select('*, faculties(name)')
    .eq('id', id)
    .single()

  // Obtener cursos y garantizar que sea un array
  const { data: coursesData } = await supabase
    .from('courses')
    .select('*')
    .eq('career_id', id)
    .order('cycle', { ascending: true })
    .order('name', { ascending: true })
  const courses = coursesData ?? []

  // Inicializar el objeto con arrays vacíos para los ciclos 1 y 2
  const coursesByCycle: Record<number, typeof courses> = { 1: [], 2: [] }
  courses.forEach(course => {
    if (course.cycle === 1 || course.cycle === 2) {
      coursesByCycle[course.cycle].push(course)
    }
  })

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
        <Link href="/dashboard" className="link" style={{ display: 'inline-block', marginBottom: '1rem' }}>
          ← Volver al inicio
        </Link>

        <div className="page-header">
          <h1>📖 {career?.name || 'Carrera'}</h1>
          <p>{(career as any)?.faculties?.name}</p>
        </div>

        {[1, 2].map(cycle => (
          <div key={cycle} className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">📅 Ciclo {cycle}</div>
            <div className="grid" style={{ gap: '0.75rem' }}>
              {coursesByCycle[cycle].length > 0 ? (
                coursesByCycle[cycle].map((course: any) => (
                  <Link
                    href={`/courses/${course.id}`}
                    key={course.id}
                    className="course-item"
                    style={{ textDecoration: 'none' }}
                  >
                    <div>
                      <strong style={{ fontSize: '16px', color: '#1f2937' }}>{course.name}</strong>
                      <p style={{ color: '#9ca3af', fontSize: '13px', margin: '2px 0 0 0' }}>
                        {course.description}
                      </p>
                    </div>
                    <span className="course-item-code">{course.code}</span>
                  </Link>
                ))
              ) : (
                <div className="empty-state">
                  <p>No hay cursos disponibles en este ciclo.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}