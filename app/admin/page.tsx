import { createClient } from '@/utils/supabase/server'
import AssignForm from './Assignform'
export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  if (!user || profile?.role !== 'admin') {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><p>Acceso denegado. Solo administradores.</p></div>
  }

  const { data: students } = await supabase.from('profiles').select('*').eq('role', 'alumno').order('created_at', { ascending: false })
  const { data: careers } = await supabase.from('careers').select('*').order('name')
  const { data: assignments } = await supabase.from('admin_assignments').select('*, profiles!student_id(full_name), careers(name)')

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#991b1b', color: 'white', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '26px', margin: '0' }}>🔧 Panel de Administración</h1>
        <p style={{ margin: '5px 0 0 0', opacity: '0.9' }}>Asignar carreras y ciclos a alumnos</p>
      </div>

      {/* Lista de alumnos asignados */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '20px', color: '#1e40af', marginBottom: '1rem' }}>✅ Alumnos asignados</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {assignments?.map(a => (
            <div key={a.id} style={{ padding: '10px', backgroundColor: '#dcfce7', borderRadius: '6px' }}>
              <strong>{a.profiles?.full_name}</strong> → {a.careers?.name} | Ciclo {a.cycle}
            </div>
          ))}
          {assignments?.length === 0 && <p style={{ color: '#9ca3af' }}>No hay alumnos asignados todavía.</p>}
        </div>
      </div>

      {/* Formulario para asignar */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '20px', color: '#1e40af', marginBottom: '1rem' }}>📋 Asignar alumno</h2>
        <AssignForm students={students || []} careers={careers || []} />
      </div>
    </div>
  )
}