import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><p>No has iniciado sesión.</p><a href="/login">Inicia sesión</a></div>
  }

  const { data: profile } = await supabase.from('profiles').select('*, careers(name)').eq('id', user.id).single()

  // Si es admin, redirigir al panel admin
  if (profile?.role === 'admin') {
    return (
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#1e40af', color: 'white', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '28px' }}>🎓 SqueroUniversity</h1>
          <p>Panel de Administrador</p>
        </div>
<form action="/auth/logout" method="post" style={{ marginTop: '10px' }}>
  <button type="submit" style={{ backgroundColor: '#dc2626', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
    🚪 Cerrar sesión
  </button>
</form>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admin" style={{ backgroundColor: '#991b1b', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            🔧 Gestionar alumnos
          </Link>
          <Link href="/courses" style={{ backgroundColor: '#2563eb', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            📚 Ver todos los cursos
          </Link>
        </div>
      </div>
    )
  }

  // Si es alumno NO aprobado
  if (profile?.role === 'alumno' && !profile?.approved) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#fef3c7', padding: '2rem', borderRadius: '10px', border: '1px solid #f59e0b' }}>
          <h2 style={{ color: '#92400e', fontSize: '22px' }}>⏳ Cuenta pendiente de aprobación</h2>
          <p style={{ color: '#92400e', marginTop: '1rem' }}>
            El administrador te asignará una carrera y ciclo pronto. Cuando seas aprobado, podrás ver tus cursos aquí.
          </p>
        </div>
      </div>
    )
  }

  // Alumno aprobado: mostrar sus cursos
  const { data: enrollments } = await supabase.from('enrollments').select('*, courses(*)').eq('user_id', user.id)

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#1e40af', color: 'white', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px', margin: '0' }}>🎓 SqueroUniversity</h1>
        <p style={{ margin: '5px 0' }}>Bienvenido, {profile?.full_name}</p>
        <p style={{ margin: '0', opacity: '0.9' }}>{profile?.careers?.name} | Ciclo {profile?.cycle}</p>
      </div>

      <h2 style={{ fontSize: '22px', color: '#1e40af', marginBottom: '1rem' }}>📚 Mis cursos - Ciclo {profile?.cycle}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {enrollments?.map(e => (
          <Link href={`/courses/${e.courses.id}`} key={e.courses.id} style={{
            backgroundColor: 'white', padding: '1rem 1.5rem', borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textDecoration: 'none', color: 'black',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <strong style={{ fontSize: '16px' }}>{e.courses.name}</strong>
              <span style={{ color: '#6b7280', marginLeft: '10px' }}>{e.courses.code}</span>
            </div>
            <span style={{ color: '#2563eb', fontWeight: 'bold' }}>Ver curso →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}