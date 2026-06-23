import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import SubmissionForm from './submissionForm'

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

  const { data: submission } = await supabase
    .from('submissions')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('user_id', user?.id)
    .maybeSingle()

  const fileUrl = assignment?.file_url
    ? supabase.storage.from('assignment-files').getPublicUrl(assignment.file_url).data.publicUrl
    : null

  const submissionUrl = submission?.file_url
    ? supabase.storage.from('submissions').getPublicUrl(submission.file_url).data.publicUrl
    : null

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
            <button
              type="submit"
              className="btn btn-sm"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              🚪 Salir
            </button>
          </form>
        </div>
      </nav>

      <div className="container">
        <Link
          href={`/courses/${id}`}
          className="link"
          style={{ display: 'inline-block', marginBottom: '1rem' }}
        >
          ← Volver al curso
        </Link>

        <div className="page-header">
          <h1>📝 {assignment?.title}</h1>
          <p>{assignment?.description}</p>
          <p style={{ marginTop: '8px' }}>
            📅 <strong>Fecha límite:</strong>{' '}
            {new Date(assignment?.due_date).toLocaleDateString('es-PE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {isLate && (
            <span
              className="badge badge-danger"
              style={{ marginTop: '8px', display: 'inline-block' }}
            >
              ⚠️ Tarea vencida
            </span>
          )}
          {fileUrl && (
            <div style={{ marginTop: '1rem' }}>
              <a href={fileUrl} target="_blank" className="btn btn-outline btn-sm">
                📎 Descargar archivo del profesor
              </a>
            </div>
          )}
          {(profile?.role === 'admin' || profile?.role === 'profesor') && (
            <div style={{ marginTop: '1rem' }}>
              <Link
                href={`/courses/${id}/assignments/${assignmentId}/submissions`}
                className="btn btn-warning btn-sm"
              >
                📋 Ver entregas de alumnos
              </Link>
            </div>
          )}
        </div>

        {profile?.role === 'alumno' && !submission && !isLate && (
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header">📤 Subir entrega</div>
            <SubmissionForm assignmentId={assignmentId} />
          </div>
        )}

        {submission && (
          <div
            className="card"
            style={{ marginTop: '1.5rem', border: '2px solid #bbf7d0' }}
          >
            <div className="card-header" style={{ color: '#065f46' }}>
              ✅ Entrega realizada
            </div>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              📅 Entregado el{' '}
              {new Date(submission.submitted_at).toLocaleDateString('es-PE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {submissionUrl && (
              <a href={submissionUrl} target="_blank" className="btn btn-outline btn-sm">
                📎 Ver mi archivo entregado
              </a>
            )}
            {submission.grade !== null && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#f0fdf4',
                  borderRadius: '8px',
                }}
              >
                <p>
                  <strong>🎯 Nota:</strong>{' '}
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#059669' }}>
                    {submission.grade}/10
                  </span>
                </p>
                {submission.feedback && (
                  <p>
                    <strong>💬 Comentario del profesor:</strong> {submission.feedback}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {!submission && isLate && profile?.role === 'alumno' && (
          <div
            className="card"
            style={{ marginTop: '1.5rem', border: '2px solid #fecaca' }}
          >
            <div className="empty-state">
              <div className="empty-state-icon">❌</div>
              <h3 style={{ color: '#991b1b' }}>No entregaste a tiempo</h3>
              <p style={{ color: '#6b7280' }}>La fecha límite ya venció.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}