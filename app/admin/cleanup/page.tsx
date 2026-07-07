import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import CleanupForm from './CleanupForm'

export default async function CleanupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="empty-state-icon">🚫</div>
        <h2>Acceso denegado</h2>
        <p style={{ color: '#6b7280' }}>Solo administradores pueden acceder a esta página.</p>
        <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver al inicio</Link>
      </div>
    )
  }

  const { data: careers } = await supabase.from('careers').select('id, name').order('name')
  const { data: courses } = await supabase.from('courses').select('id, name, code, career_id, cycle').order('name')

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
        <Link href="/admin" className="link" style={{ display: 'inline-block', marginBottom: '1rem' }}>← Volver al panel de administración</Link>
        
        <div className="page-header" style={{ background: 'linear-gradient(135deg, #b91c1c, #7f1d1d)' }}>
          <h1>🧹 Limpieza de Almacenamiento</h1>
          <p>Elimina archivos de entregas de alumnos para liberar espacio</p>
        </div>

        <div className="card">
          <CleanupForm careers={careers || []} courses={courses || []} />
        </div>
      </div>
    </div>
  )
}