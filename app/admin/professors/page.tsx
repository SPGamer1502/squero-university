import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import ProfessorForm from './ProfessorForm'

export default async function ProfessorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  if (!user || profile?.role !== 'admin') {
    return <div className="container"><p>Acceso denegado</p></div>
  }

  const { data: professors } = await supabase.from('profiles').select('*').eq('role', 'profesor')
  const { data: courses } = await supabase.from('courses').select('*, careers(name)').order('name')
  const { data: assignments } = await supabase.from('professor_assignments')
    .select('*, profiles!professor_id(full_name), courses(name, code, careers(name))')

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <a href="/dashboard" className="navbar-brand" style={{ textDecoration: 'none' }}>
            <div className="navbar-brand-icon">🎓</div>
            <div>
              <div className="navbar-brand-text">SqueroUniversity</div>
              <div className="navbar-brand-subtext">Panel Admin</div>
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
        <Link href="/admin" className="link" style={{ display: 'inline-block', marginBottom: '1rem' }}>← Volver al panel admin</Link>
        
        <div className="page-header" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
          <h1>👨‍🏫 Gestión de Profesores</h1>
          <p>Asigna profesores a cursos</p>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <div className="card-header">✅ Profesores Asignados</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {assignments?.map((a: any) => (
                <div key={a.id} style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>👨‍🏫 {a.profiles?.full_name}</strong>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>
                      📚 {a.courses?.name} ({a.courses?.code}) - {a.courses?.careers?.name}
                    </p>
                  </div>
                  <ProfessorForm 
                    assignmentId={a.id}
                    professorId={a.professor_id}
                    currentCourseId={a.course_id}
                    courses={courses || []}
                    mode="edit"
                  />
                </div>
              ))}
              {(!assignments || assignments.length === 0) && (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>No hay profesores asignados</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">📋 Asignar Profesor</div>
            <ProfessorForm 
              professors={professors || []}
              courses={courses || []}
              mode="create"
            />
          </div>
        </div>
      </div>
    </div>
  )
}