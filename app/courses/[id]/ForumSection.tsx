'use client'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useCallback } from 'react'

export default function ForumSection({ courseId, role }: { courseId: number; role: string }) {
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from('forum_posts')
      .select('*, profiles(full_name)')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })
    setPosts(data || [])
  }, [courseId])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

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
      fetchPosts()
    } else {
      alert('Error al publicar')
    }
    setLoading(false)
  }

  const handleDelete = async (postId: number) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    await supabase.from('forum_posts').delete().eq('id', postId)
    fetchPosts()
  }

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <div className="card-header">💬 Foro del curso</div>

      <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
        {posts.length === 0 && <p style={{ color: '#9ca3af' }}>No hay mensajes aún.</p>}
        {posts.map(post => (
          <div key={post.id} style={{ borderBottom: '1px solid #e5e7eb', padding: '0.75rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: '14px' }}>{post.profiles?.full_name}</strong>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                {new Date(post.created_at).toLocaleString('es-PE')}
              </span>
            </div>
            <p style={{ margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>{post.content}</p>
            {(role === 'admin' || role === 'profesor') && (
              <button onClick={() => handleDelete(post.id)} className="btn btn-danger btn-sm" style={{ fontSize: '12px' }}>
                🗑️ Eliminar
              </button>
            )}
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