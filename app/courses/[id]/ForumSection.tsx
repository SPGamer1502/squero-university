'use client'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useCallback } from 'react'

export default function ForumSection({ courseId, role, userId }: { courseId: number; role: string; userId: string }) {
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState<number | null>(null) // ID del post cuyo menú está abierto
  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from('forum_posts')
      .select('*, profiles(full_name)')
      .eq('course_id', courseId)
      .order('created_at', { ascending: true })
    setPosts(data || [])
  }, [courseId])

  // Cargar posts iniciales
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Suscripción en tiempo real para nuevos mensajes
  useEffect(() => {
    const channel = supabase
      .channel(`forum-${courseId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_posts',
          filter: `course_id=eq.${courseId}`,
        },
        (payload) => {
          setPosts((prev) => [...prev, payload.new])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'forum_posts',
          filter: `course_id=eq.${courseId}`,
        },
        (payload) => {
          setPosts((prev) => prev.filter((p) => p.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [courseId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('forum_posts').insert({
      course_id: courseId,
      user_id: user.id,
      content: newPost.trim()
    })
    if (!error) {
      setNewPost('')
      // No necesitamos fetch manual, Realtime lo agrega
    } else {
      alert('Error al publicar')
    }
    setLoading(false)
  }

  const handleDelete = async (postId: number) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    const { error } = await supabase.from('forum_posts').delete().eq('id', postId)
    if (error) {
      alert('Error al eliminar: ' + error.message)
    }
    setMenuOpen(null)
  }

  // Vaciar todo el foro (solo admin/profesor)
  const handleClearAll = async () => {
    if (!confirm('¿Eliminar TODOS los mensajes del foro? Esta acción no se puede deshacer.')) return
    const { error } = await supabase.from('forum_posts').delete().eq('course_id', courseId)
    if (error) {
      alert('Error al vaciar el foro: ' + error.message)
    } else {
      setPosts([])
    }
  }

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>💬 Foro del curso</span>
        {(role === 'admin' || role === 'profesor') && (
          <button onClick={handleClearAll} className="btn btn-danger btn-sm" style={{ fontSize: '12px' }}>
            🗑️ Vaciar foro
          </button>
        )}
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
        {posts.length === 0 && <p style={{ color: '#9ca3af', padding: '1rem' }}>No hay mensajes aún.</p>}
        {posts.map(post => (
          <div key={post.id} style={{ borderBottom: '1px solid #e5e7eb', padding: '0.75rem 0', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '14px' }}>{post.profiles?.full_name}</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {new Date(post.created_at).toLocaleString('es-PE')}
                </span>
                {/* Menú de tres puntos */}
                {(post.user_id === (supabase.auth.getUser() as any)?.id || role === 'admin' || role === 'profesor') && (
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '0 4px',
                        color: '#6b7280',
                      }}
                    >
                      •••
                    </button>
                    {menuOpen === post.id && (
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          zIndex: 10,
                        }}
                      >
                        <button
                          onClick={() => handleDelete(post.id)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '6px 12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: '#dc2626',
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p style={{ margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>{post.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="form-input"
          style={{ flex: 1 }}
          required
        />
        <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
          {loading ? '...' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}