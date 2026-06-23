import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import SubmissionForm from './submissionForm'
import GradeForm from './submissions/GradeForm' // ← ruta corregida

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>
}) {
  const { id, assignmentId } = await params
  const supabase = await createClient()

  const { data: assignment } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', assignmentId)
    .single()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single()

  // Obtener todas las entregas de esta tarea
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*, profiles!user_id(full_name)')
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: false })

  // Si es alumno, su entrega más reciente
  const mySubmission = profile?.role === 'alumno'
    ? submissions?.find(s => s.user_id === user?.id) ?? null
    : null

  // Enlace firmado del archivo del profesor
  const fileUrl = assignment?.file_url
    ? (await supabase.storage.from('assignment-files').createSignedUrl(assignment.file_url, 3600)).data?.signedUrl
    : null

  // Resolver URLs firmadas de todas las entregas (para profesor/alumno)
  const submissionsWithUrls = submissions
    ? await Promise.all(
        submissions.map(async (sub) => {
          if (!sub.file_url) return { ...sub, signedUrl: null }
          const { data } = await supabase.storage
            .from('submissions')
            .createSignedUrl(sub.file_url, 3600)
          return { ...sub, signedUrl: data?.signedUrl ?? null }
        })
      )
    : []

  // URL firmada de la entrega del alumno
  const mySignedUrl = mySubmission
    ? submissionsWithUrls.find(s => s.id === mySubmission.id)?.signedUrl ?? undefined
    : undefined

  const isLate = assignment ? new Date() > new Date(assignment.due_date) : false

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
            <button type="submit" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>🚪 Salir</button>
          </form>
        </div>
      </nav>

      <div className="container">
        <Link href={`/courses/${id}`} className="link" style={{ display: 'inline-block', marginBottom: '1rem' }}>← Volver al curso</Link>

        <div className="page-header">
          <h1>📝 {assignment?.title}</h1>
          <p>{assignment?.description}</p>
          <p style={{ marginTop: '8px' }}>
            📅 <strong>Fecha límite:</strong>{' '}
            {new Date(assignment?.due_date).toLocaleDateString('es-PE', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
          {isLate && <span className="badge badge-danger" style={{ marginTop: '8px', display: 'inline-block' }}>⚠️ Tarea vencida</span>}
          {fileUrl && (
            <div style={{ marginTop: '1rem' }}>
              <a href={fileUrl} target="_blank" className="btn btn-outline btn-sm">📎 Descargar archivo del profesor</a>
            </div>
          )}
          {(profile?.role === 'admin' || profile?.role === 'profesor') && (
            <div style={{ marginTop: '1rem' }}>
              <Link href={`/courses/${id}/assignments/${assignmentId}/submissions`} className="btn btn-warning btn-sm">
                📋 Ver todas las entregas
              </Link>
            </div>
          )}
        </div>

        {/* ========== ALUMNO ========== */}
        {profile?.role === 'alumno' && (
          <>
            {!mySubmission && !isLate && (
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <div className="card-header">📤 Subir entrega</div>
                <SubmissionForm assignmentId={assignmentId} />
              </div>
            )}

            {mySubmission && (
              <div className="card" style={{ marginTop: '1.5rem', border: '2px solid #bbf7d0' }}>
                <div className="card-header" style={{ color: '#065f46' }}>✅ Tu entrega</div>
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  📅 Entregado el {new Date(mySubmission.submitted_at).toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                {mySignedUrl ? (
                  <a href={mySignedUrl} target="_blank" className="btn btn-outline btn-sm">📎 Ver mi archivo</a>
                ) : (
                  <span style={{ color: '#9ca3af' }}>Archivo no disponible</span>
                )}
                {mySubmission.grade !== null && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
                    <p><strong>🎯 Nota:</strong> <span style={{ fontSize: '24px', fontWeight: 800, color: '#059669' }}>{mySubmission.grade}/20</span></p>
                    {mySubmission.feedback && <p><strong>💬 Comentario:</strong> {mySubmission.feedback}</p>}
                  </div>
                )}
              </div>
            )}

            {!mySubmission && isLate && (
              <div className="card" style={{ marginTop: '1.5rem', border: '2px solid #fecaca' }}>
                <div className="empty-state"><div className="empty-state-icon">❌</div><h3 style={{ color: '#991b1b' }}>No entregaste a tiempo</h3></div>
              </div>
            )}
          </>
        )}

        {/* ========== PROFESOR / ADMIN ========== */}
        {(profile?.role === 'admin' || profile?.role === 'profesor') && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '22px', color: '#1e40af' }}>📤 Entregas de alumnos ({submissionsWithUrls.length})</h2>
              <Link href={`/courses/${id}/assignments/${assignmentId}/submissions`} className="btn btn-outline btn-sm">📋 Ver lista completa</Link>
            </div>
            {submissionsWithUrls.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {submissionsWithUrls.map((sub) => (
                  <div key={sub.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '18px' }}>👤 {sub.profiles?.full_name}</strong>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>📅 {new Date(sub.submitted_at).toLocaleString('es-PE')}</span>
                    </div>
                    {sub.signedUrl ? (
                      <a href={sub.signedUrl} target="_blank" style={{ color: '#2563eb', fontWeight: 'bold' }}>📎 Ver archivo</a>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Sin archivo</span>
                    )}
                    <GradeForm submissionId={sub.id} currentGrade={sub.grade} currentFeedback={sub.feedback} />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center' }}>No hay entregas todavía.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}