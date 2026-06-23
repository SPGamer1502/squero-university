// Server Component - obtiene params y pasa el courseId al cliente
import CreateAssignmentClient from './CreateAssignmentClient'

export default function CreateAssignmentPage({ params }: { params: { id: string } }) {
  const courseId = parseInt(params.id)

  return <CreateAssignmentClient courseId={courseId} />
}