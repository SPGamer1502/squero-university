// Server Component asíncrono
import CreateAssignmentClient from './CreateAssignmentClient'

export default async function CreateAssignmentPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const courseId = parseInt(id)

  return <CreateAssignmentClient courseId={courseId} />
}