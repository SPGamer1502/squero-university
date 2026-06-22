import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import AssignForm from './Assignform'
import EditForm from './EditForm'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="empty-state-icon">🚫</div>
        <h2>Acceso denegado</h2>
        <p style={{ color: '#6b7280' }}>Solo administradores pueden ver esta página.</p>
        <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver</Link>
      </div>
    )
  }

  const { data: students } = await supabase.from('profiles').select('*').eq('role', 'alumno').order('created_at', { ascending: false })
  const { data: careers } = await supabase.from('careers').select('*').order('name')
  const { data: assignments } = await supabase.from('admin_assignments').select('*, profiles!student_id(full_name), careers(name)')

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
        <div className="page-header" style={{ background: 'linear-gradient(135deg, #991b1b, #7f1d1d)' }}>
          <h1>🔧 Gestión de Alumnos</h1>
          <p>Asigna, edita y administra carreras y ciclos</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <Link href="/admin/professors" className="btn btn-warning btn-sm">
              👨‍🏫 Gestionar Profesores
            </Link>
          </div>
        </div>

        {/* ALUMNOS ASIGNADOS */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">✅ Alumnos Asignados ({assignments?.length || 0})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto' }}>
            {assignments?.map((a: any) => (
              <div key={a.id} style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong style={{ fontSize: '16px' }}>👤 {a.profiles?.full_name}</strong>
                  <span style={{ color: '#6b7280', marginLeft: '12px' }}>
                    📚 {a.careers?.name} · 🎯 Ciclo {a.cycle}
                  </span>
                </div>
                <EditForm 
                  assignmentId={a.id} 
                  studentId={a.student_id} 
                  currentCareerId={a.career_id} 
                  currentCycle={a.cycle} 
                  careers={careers || []} 
                />
              </div>
            ))}
            {(!assignments || assignments.length === 0) && (
              <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>No hay alumnos asignados todavía.</p>
            )}
          </div>
        </div>

        {/* NUEVA ASIGNACIÓN */}
        <div className="card">
          <div className="card-header">📋 Nueva Asignación</div>
          <AssignForm students={students || []} careers={careers || []} />
        </div>
      </div>
    </div>
  )
}