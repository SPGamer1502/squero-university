'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteAssignmentButton({ assignmentId, courseId }: { assignmentId: number; courseId: number }) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta tarea y todas sus entregas? Esta acción no se puede deshacer.')) return

    setLoading(true)

    // 1. Obtener el assignment para conocer su file_url (si tiene)
    const { data: assignment } = await supabase
      .from('assignments')
      .select('file_url')
      .eq('id', assignmentId)
      .single()

    // 2. Obtener todas las submissions de la tarea (para borrar sus archivos)
    const { data: submissions } = await supabase
      .from('submissions')
      .select('id, file_url')
      .eq('assignment_id', assignmentId)

    // 3. Eliminar archivos de submissions del storage
    if (submissions && submissions.length > 0) {
      const submissionPaths = submissions.map(s => s.file_url).filter(Boolean)
      if (submissionPaths.length > 0) {
        // Borramos en lotes de 1000 (límite de Supabase)
        for (let i = 0; i < submissionPaths.length; i += 1000) {
          const batch = submissionPaths.slice(i, i + 1000)
          await supabase.storage.from('submissions').remove(batch)
        }
      }
      // Eliminar registros de submissions
      const submissionIds = submissions.map(s => s.id)
      await supabase.from('submissions').delete().in('id', submissionIds)
    }

    // 4. Eliminar archivo del assignment (si tiene)
    if (assignment?.file_url) {
      await supabase.storage.from('assignment-files').remove([assignment.file_url])
    }

    // 5. Eliminar el assignment
    const { error } = await supabase.from('assignments').delete().eq('id', assignmentId)
    if (error) {
      alert('Error al eliminar la tarea: ' + error.message)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn btn-danger btn-sm"
      style={{ fontSize: '12px', padding: '4px 10px' }}
    >
      {loading ? 'Eliminando...' : '🗑️ Eliminar'}
    </button>
  )
}