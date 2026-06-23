'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('alumno')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: { 
          full_name: fullName,
          role: role 
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      if (role === 'alumno' || role === 'profesor') {
        setSuccess('¡Cuenta creada! El administrador te asignará pronto. Redirigiendo al login...')
      } else {
        setSuccess('¡Cuenta de admin creada! Redirigiendo...')
      }
      setTimeout(() => router.push('/login'), 3000)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #1a365d, #2a4a7f)', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '1rem' }}>
            🎓
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a365d' }}>SqueroUniversity</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Crear cuenta nueva</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input type="text" placeholder="Tu nombre" value={fullName} onChange={e => setFullName(e.target.value)}
                className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)}
                className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña (mínimo 6 caracteres)</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                className="form-input" required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Rol</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="form-select">
                <option value="alumno">🎓 Alumno</option>
                <option value="profesor">👨‍🏫 Profesor</option>
                <option value="admin">🔧 Administrador</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="btn btn-success" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {loading ? 'Creando cuenta...' : '✨ Crear cuenta'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="link" style={{ fontWeight: 600 }}>Iniciar sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}