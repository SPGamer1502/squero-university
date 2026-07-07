import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LandingPage from '@/components/landing/LandingPage'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  // Intentar obtener carreras desde Supabase (si no hay datos, la landing usará las predefinidas)
  const { data: careers } = await supabase
    .from('careers')
    .select('*, faculties(name)')
    .order('name')

  return <LandingPage careers={careers || []} />
}