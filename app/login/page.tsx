'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Correo o contraseña incorrectos')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #1a365d, #2a4a7f)', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '1rem' }}>
            🎓
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a365d', letterSpacing: '-0.5px' }}>SqueroUniversity</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Aula Virtual - UNICA</p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>Iniciar Sesión</h2>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)}
                className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                className="form-input" required />
            </div>
            <button type="submit" disabled={loading}
              className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '0.5rem' }}>
              {loading ? 'Entrando...' : '🔐 Iniciar sesión'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              ¿No tienes cuenta?{' '}
              <a href="/register" className="link" style={{ fontWeight: 600 }}>Crear cuenta</a>
            </p>
          </div>
        </div>
        
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '1.5rem' }}>
          Universidad Nacional San Luis Gonzaga © 2026
        </p>
      </div>
    </div>
  )
}