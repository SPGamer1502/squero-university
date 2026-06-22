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
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) {
      setError(error.message)
      return
    }
    if (data.user) {
      await supabase.from('profiles').update({ role, full_name: fullName }).eq('id', data.user.id)
      if (role === 'alumno') {
        setSuccess('¡Cuenta creada! El administrador te asignará una carrera y ciclo. Espera la confirmación.')
      } else {
        setSuccess('¡Cuenta creada con éxito! Redirigiendo al login...')
        setTimeout(() => router.push('/login'), 3000)
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      <form onSubmit={handleRegister} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '400px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center', color: '#1e40af' }}>
          SqueroUniversity
        </h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem' }}>UNICA - Crear cuenta</p>
        {error && <p style={{ color: 'red', marginBottom: '0.5rem', fontSize: '14px', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '4px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginBottom: '0.5rem', fontSize: '14px', backgroundColor: '#dcfce7', padding: '8px', borderRadius: '4px' }}>{success}</p>}
        
        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>Nombre completo</label>
        <input type="text" placeholder="Juan Pérez" value={fullName} onChange={(e) => setFullName(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        
        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>Correo electrónico</label>
        <input type="email" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        
        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>Contraseña (mínimo 6 caracteres)</label>
        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }} required />
        
        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>Rol</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>
          <option value="alumno">Alumno (requiere asignación del admin)</option>
          <option value="profesor">Profesor</option>
          <option value="admin">Administrador</option>
        </select>
        
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Crear cuenta
        </button>
        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          ¿Ya tienes cuenta? <a href="/login" style={{ color: '#2563eb', fontWeight: 'bold' }}>Inicia sesión</a>
        </p>
      </form>
    </div>
  )
}