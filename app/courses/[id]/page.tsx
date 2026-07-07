import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import NoticeForm from './NoticeForm'
import ForumSection from './ForumSection'
import ForumToggle from './ForumToggle'

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*, career:careers(name), forum_enabled')
    .eq('id', id)
    .single()

  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .eq('course_id', id)
    .order('due_date', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single()

  const { data: activeNotice } = await supabase
    .from('notices')
    .select('*')
    .eq('course_id', id)
    .or('is_permanent.eq.true,expires_at.gte.now()')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Obtener nombre de carrera seguro
  let courseCareerName = 'Sin carrera'
  if (course?.career && Array.isArray(course.career) && course.career.length > 0) {
    courseCareerName = course.career[0].name
  } else if (course?.career_id) {
    const { data: careerData } = await supabase
      .from('careers')
      .select('name')
      .eq('id', course.career_id)
      .single()
    courseCareerName = careerData?.name || 'Sin carrera'
  }

  const forumEnabled = course?.forum_enabled ?? false

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
        <Link href="/courses" className="link" style={{ display: 'inline-block', marginBottom: '1rem' }}>← Volver a cursos</Link>

        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h1>📖 {course?.name}</h1>
            {(profile?.role === 'admin' || profile?.role === 'profesor') && (
              <ForumToggle courseId={parseInt(id)} enabled={forumEnabled} />
            )}
          </div>
          <p>{courseCareerName} · Ciclo {course?.cycle}</p>
          <p style={{ fontSize: '14px', marginTop: '4px' }}>{course?.description}</p>
        </div>

        {/* Bloque de aviso */}
        {activeNotice ? (
          <div className="card" style={{ backgroundColor: '#fff3cd', border: '2px solid #ffc107', marginBottom: '1.5rem' }}>
            <div className="card-header" style={{ background: '#ffc107', color: '#000' }}>
              📢 Aviso: {activeNotice.title}
            </div>
            <p style={{ whiteSpace: 'pre-wrap', padding: '1rem' }}>{activeNotice.content}</p>
            {(profile?.role === 'admin' || profile?.role === 'profesor') && (
              <NoticeForm courseId={parseInt(id)} notice={activeNotice} />
            )}
          </div>
        ) : (
          (profile?.role === 'admin' || profile?.role === 'profesor') && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">📢 Crear un aviso</div>
              <div style={{ padding: '1rem' }}>
                <NoticeForm courseId={parseInt(id)} />
              </div>
            </div>
          )
        )}

        {/* Foro (visible si está habilitado o para admin/profesor) */}
        {(forumEnabled || profile?.role === 'admin' || profile?.role === 'profesor') && (
          <ForumSection courseId={parseInt(id)} role={profile?.role || 'alumno'} userId={user?.id || ''} />
        )}

        {/* Botones de tareas y exámenes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="card-header" style={{ margin: 0, border: 'none', padding: 0 }}>📝 Tareas del Curso</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {(profile?.role === 'admin' || profile?.role === 'profesor') && (
              <Link href={`/courses/${id}/assignments/create`} className="btn btn-success">
                ➕ Nueva Tarea
              </Link>
            )}
            <Link href={`/courses/${id}/exams`} className="btn btn-primary">
              📝 Exámenes
            </Link>
          </div>
        </div>

        <div className="grid" style={{ gap: '0.75rem' }}>
          {assignments?.map((a: any) => {
            const isExpired = new Date(a.due_date) < new Date()
            return (
              <Link href={`/courses/${id}/assignments/${a.id}`} key={a.id} className="card" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '16px', color: '#1f2937' }}>{a.title}</strong>
                    <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
                      📅 {new Date(a.due_date).toLocaleDateString('es-PE', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
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