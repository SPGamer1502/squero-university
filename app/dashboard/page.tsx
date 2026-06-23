import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="empty-state-icon">🔒</div>
        <p style={{ fontSize: '18px', color: '#6b7280' }}>No has iniciado sesión.</p>
        <a href="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>Iniciar sesión</a>
      </div>
    )
  }

  const { data: profile } = await supabase.from('profiles').select('*, careers(name)').eq('id', user.id).single()
  const { data: faculties } = await supabase.from('faculties').select('*, careers(*)')

  // ========== ADMIN DASHBOARD ==========
  if (profile?.role === 'admin') {
    return (
      <div>
        <nav className="navbar">
          <div className="navbar-brand">
            <div className="navbar-brand-icon">🎓</div>
            <div>
              <div className="navbar-brand-text">SqueroUniversity</div>
              <div className="navbar-brand-subtext">SqueroU</div>
            </div>
          </div>
          <div className="navbar-user">
            <div className="navbar-user-info">
              <div className="navbar-user-name">{profile?.full_name}</div>
              <div className="navbar-user-role">Administrador</div>
            </div>
            <form action="/auth/logout" method="post">
              <button type="submit" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                🚪 Salir
              </button>
            </form>
          </div>
        </nav>

        <div className="container">
          <div className="page-header">
            <h1>🔧 Panel de Administración</h1>
            <p>Gestiona alumnos, carreras y cursos</p>
          </div>

          <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
            <Link href="/admin" className="card" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>👥</div>
              <h3 style={{ color: '#1a365d', fontSize: '18px' }}>Gestionar Alumnos</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Asignar carreras y ciclos</p>
            </Link>
            <Link href="/admin/professors" className="card" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>👨‍🏫</div>
              <h3 style={{ color: '#1a365d', fontSize: '18px' }}>Gestionar Profesores</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Asignar profesores a cursos</p>
            </Link>
            <Link href="/courses" className="card" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📚</div>
              <h3 style={{ color: '#1a365d', fontSize: '18px' }}>Todos los Cursos</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Ver catálogo completo</p>
            </Link>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a365d', marginBottom: '1rem' }}>🏛️ Facultades y Carreras</h2>
          {faculties?.map(faculty => (
            <div key={faculty.id} className="faculty-card">
              <h3>🏛️ {faculty.name}</h3>
              <div className="grid grid-3" style={{ marginTop: '1rem' }}>
                {(faculty as any).careers?.map((career: any) => (
                  <Link href={`/careers/${career.id}`} key={career.id}
                    className="btn btn-outline btn-sm" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                    {career.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ========== PROFESOR NO APROBADO ==========
  if (profile?.role === 'profesor' && !profile?.approved) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="empty-state-icon">⏳</div>
          <h2 style={{ color: '#92400e', fontSize: '20px' }}>Cuenta pendiente de asignación</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            El administrador te asignará a tus cursos pronto.
          </p>
          <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
            Recibirás acceso cuando el admin te asigne a un curso.
          </div>
        </div>
      </div>
    )
  }

  // ========== PROFESOR APROBADO ==========
  if (profile?.role === 'profesor') {
    const { data: profCourses } = await supabase.from('professor_assignments')
      .select('*, courses(*, careers(name))').eq('professor_id', user.id)

    // Obtener cursos con avisos activos
    const { data: coursesWithNotices } = await supabase
      .from('notices')
      .select('course_id')
      .or('is_permanent.eq.true,expires_at.gte.now()')

    return (
      <div>
        <nav className="navbar">
          <div className="navbar-brand">
            <div className="navbar-brand-icon">🎓</div>
            <div>
              <div className="navbar-brand-text">SqueroUniversity</div>
              <div className="navbar-brand-subtext">SqueroU</div>
            </div>
          </div>
          <div className="navbar-user">
            <div className="navbar-user-info">
              <div className="navbar-user-name">{profile?.full_name}</div>
              <div className="navbar-user-role">Profesor</div>
            </div>
            <form action="/auth/logout" method="post">
              <button type="submit" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                🚪 Salir
              </button>
            </form>
          </div>
        </nav>

        <div className="container">
          <div className="page-header" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
            <h1>👨‍🏫 Mis Cursos</h1>
            <p>Profesor: {profile?.full_name}</p>
          </div>

          <div className="grid grid-2">
            {profCourses?.map((pc: any) => (
              <Link href={`/courses/${pc.courses.id}`} key={pc.id} className="card" style={{ textDecoration: 'none', position: 'relative' }}>
                <div style={{ fontSize: '28px', marginBottom: '0.5rem' }}>📖</div>
                <strong style={{ fontSize: '18px', color: '#1f2937' }}>{pc.courses.name}</strong>
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                  {pc.courses.code} · {pc.courses.careers?.name} · Ciclo {pc.courses.cycle}
                </p>
                {coursesWithNotices?.some(n => n.course_id === pc.courses.id) && (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', color: 'red', fontSize: '20px' }}>🔴</span>
                )}
                <span className="badge badge-primary" style={{ marginTop: '8px', display: 'inline-block' }}>Ver curso →</span>
              </Link>
            ))}
            {(!profCourses || profCourses.length === 0) && (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p>No tienes cursos asignados todavía.</p>
                <p style={{ fontSize: '14px', color: '#9ca3af' }}>El administrador te asignará cursos pronto.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ========== ALUMNO NO APROBADO ==========
  if (profile?.role === 'alumno' && !profile?.approved) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="empty-state-icon">⏳</div>
          <h2 style={{ color: '#92400e', fontSize: '20px' }}>Cuenta pendiente de aprobación</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            El administrador te asignará una carrera y ciclo pronto.
          </p>
          <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
            Serás notificado cuando tu cuenta sea aprobada.
          </div>
        </div>
      </div>
    )
  }

  // ========== ALUMNO APROBADO ==========
  const { data: enrollments } = await supabase.from('enrollments').select('*, courses(*)').eq('user_id', user.id)

  // Obtener cursos con avisos activos
  const { data: coursesWithNotices } = await supabase
    .from('notices')
    .select('course_id')
    .or('is_permanent.eq.true,expires_at.gte.now()')

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">🎓</div>
          <div>
            <div className="navbar-brand-text">SqueroUniversity</div>
            <div className="navbar-brand-subtext">SqueroU</div>
          </div>
        </div>
        <div className="navbar-user">
          <div className="navbar-user-info">
            <div className="navbar-user-name">{profile?.full_name}</div>
            <div className="navbar-user-role">{profile?.careers?.[0]?.name || 'Sin carrera'} · Ciclo {profile?.cycle}</div>
          </div>
          <form action="/auth/logout" method="post">
            <button type="submit" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              🚪 Salir
            </button>
          </form>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <h1>👋 Bienvenido, {profile?.full_name}</h1>
          <p>{profile?.careers?.[0]?.name || 'Sin carrera'} · Ciclo {profile?.cycle}</p>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a365d', marginBottom: '1rem' }}>📚 Mis Cursos</h2>
        <div className="grid" style={{ gap: '0.75rem' }}>
          {enrollments?.map((e: any) => (
            <Link href={`/courses/${e.courses.id}`} key={e.courses.id} className="course-item" style={{ textDecoration: 'none', position: 'relative' }}>
              <div>
                <strong style={{ fontSize: '16px', color: '#1f2937' }}>{e.courses.name}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="course-item-code">{e.courses.code}</span>
                {coursesWithNotices?.some(n => n.course_id === e.courses.id) && (
                  <span style={{ color: 'red', fontSize: '20px' }}>🔴</span>
                )}
                <span style={{ color: '#2563eb', fontWeight: 600 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}