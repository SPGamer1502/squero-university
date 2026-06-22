import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import EnrollButton from './EnrollButton'

export default async function CareerPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: career } = await supabase.from('careers').select('*, faculties(name)').eq('id', params.id).single()
  const { data: courses } = await supabase.from('courses').select('*').eq('career_id', params.id).order('cycle', { ascending: true })
  const { data: { user } } = await supabase.auth.getUser()

  const coursesByCycle: { [key: number]: any[] } = {}
  courses?.forEach(course => {
    if (!coursesByCycle[course.cycle]) coursesByCycle[course.cycle] = []
    coursesByCycle[course.cycle].push(course)
  })

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#2563eb', textDecoration: 'none' }}>← Volver al inicio</Link>
      </div>
      
      <div style={{ backgroundColor: '#1e40af', color: 'white', padding: '1.5rem 2rem', borderRadius: '10px', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px', margin: '0' }}>📖 {career?.name}</h1>
        <p style={{ margin: '5px 0 0 0', opacity: '0.9' }}>{(career as any)?.faculties?.name}</p>
      </div>

      {[1, 2].map(cycle => (
        <div key={cycle} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '22px', color: '#1e40af', marginBottom: '1rem' }}>📅 Ciclo {cycle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {coursesByCycle[cycle]?.map((course: any) => (
              <div key={course.id} style={{
                backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px',
                border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <strong style={{ fontSize: '16px' }}>{course.name}</strong>
                  <span style={{ color: '#6b7280', marginLeft: '10px', fontSize: '14px' }}>{course.code}</span>
                  <p style={{ color: '#9ca3af', margin: '4px 0 0 0', fontSize: '13px' }}>{course.description}</p>
                </div>
                {user && <EnrollButton courseId={course.id} />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}