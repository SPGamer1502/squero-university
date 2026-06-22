import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: course } = await supabase.from('courses').select('*, careers(name)').eq('id', params.id).single()
  const { data: assignments } = await supabase.from('assignments').select('*').eq('course_id', params.id).order('due_date', { ascending: false })
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <a href="/dashboard" className="navbar-brand" style={{ textDecoration: 'none' }}>
            <div className="navbar-brand-icon">🎓</div>
            <div>
              <div className="navbar-brand-text">SqueroUniversity</div>
              <div className="navbar-brand-subtext">UNICA</div>
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
        <Link href="/courses" className="link" style={{ display: 'inline-block', marginBottom: '1rem' }}>← Volver a cursos</Link>
        
        <div className="page-header">
          <h1>📖 {course?.name}</h1>
          <p>{(course as any)?.careers?.name} · Ciclo {course?.cycle}</p>
          <p style={{ fontSize: '14px', marginTop: '4px' }}>{course?.description}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="card-header" style={{ margin: 0, border: 'none', padding: 0 }}>📝 Tareas del Curso</h2>
          {(profile?.role === 'admin' || profile?.role === 'profesor') && (
            <Link href={`/courses/${params.id}/assignments/create`} className="btn btn-success">
              ➕ Nueva Tarea
            </Link>
          )}
        </div>

        <div className="grid" style={{ gap: '0.75rem' }}>
          {assignments?.map((a: any) => {
            const isExpired = new Date(a.due_date) < new Date()
            return (
              <Link href={`/courses/${params.id}/assignments/${a.id}`} key={a.id} className="card" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '16px', color: '#1f2937' }}>{a.title}</strong>
                    <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
                      📅 {new Date(a.due_date).toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {isExpired ? <span className="badge badge-danger">Vencida</span> : <span className="badge badge-success">Activa</span>}
                </div>
              </Link>
            )
          })}
          {(!assignments || assignments.length === 0) && (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>No hay tareas asignadas todavía.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}