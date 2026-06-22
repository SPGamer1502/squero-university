'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '380px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center', color: '#1e40af' }}>
          SqueroUniversity
        </h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem' }}>Plataforma educativa</p>
        <h2 style={{ fontSize: '20px', marginBottom: '1rem', textAlign: 'center' }}>Iniciar sesión</h2>
        {error && <p style={{ color: 'red', marginBottom: '0.5rem', fontSize: '14px', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '4px' }}>{error}</p>}
        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>Correo electrónico</label>
        <input type="email" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>Contraseña</label>
        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Entrar
        </button>
        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          ¿No tienes cuenta? <a href="/register" style={{ color: '#2563eb', fontWeight: 'bold' }}>Regístrate aquí</a>
        </p>
      </form>
    </div>
  )
}