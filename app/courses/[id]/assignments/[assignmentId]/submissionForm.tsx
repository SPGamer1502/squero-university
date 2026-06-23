'use client'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmissionForm({ assignmentId: initialAssignmentId }: { assignmentId: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [assignmentId, setAssignmentId] = useState<number>(parseInt(initialAssignmentId))
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Si el ID no es válido, lo obtenemos de la URL
  useEffect(() => {
    if (isNaN(parseInt(initialAssignmentId))) {
      const path = window.location.pathname
      const match = path.match(/\/courses\/\d+\/assignments\/(\d+)/)
      if (match) setAssignmentId(parseInt(match[1]))
    }
  }, [initialAssignmentId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)

    if (isNaN(assignmentId)) {
      alert('Error: No se pudo identificar la tarea.')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Buscar entrega existente de este alumno en esta tarea
    const { data: existing } = await supabase
      .from('submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .eq('user_id', user.id)
      .maybeSingle()

    // 2. Subir el nuevo archivo
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(`${assignmentId}/${user.id}/${Date.now()}-${file.name}`, file)

    if (uploadError) {
      alert('Error al subir archivo: ' + uploadError.message)
      setLoading(false)
      return
    }

    const newFileUrl = uploadData?.path || ''

    // 3. Si ya existía, eliminar el archivo antiguo y actualizar la fila
    if (existing) {
      // Eliminar archivo antiguo del storage
      const oldPath = existing.file_url
      if (oldPath) {
        await supabase.storage.from('submissions').remove([oldPath])
      }

      // Actualizar la entrega existente
      const { error: updateError } = await supabase
        .from('submissions')
        .update({
          file_url: newFileUrl,
          submitted_at: new Date().toISOString(),
          grade: null,        // opcional: reiniciar nota al re-entregar
          feedback: null
        })
        .eq('id', existing.id)

      if (updateError) {
        alert('Error al actualizar: ' + updateError.message)
      } else {
        alert('✅ Entrega actualizada')
        router.refresh()
      }
    } else {
      // Insertar nueva entrega
      const { error: insertError } = await supabase
        .from('submissions')
        .insert({
          assignment_id: assignmentId,
          user_id: user.id,
          file_url: newFileUrl,
        })

      if (insertError) {
        alert('Error al guardar: ' + insertError.message)
      } else {
        alert('✅ Tarea entregada con éxito')
        router.refresh()
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Selecciona tu archivo</label>
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="form-input"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {loading ? 'Subiendo...' : '📤 Entregar tarea'}
      </button>
    </form>
  )
}