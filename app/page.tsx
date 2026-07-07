import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LandingPage from '@/components/landing/LandingPage'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si ya está logueado, lo llevamos al dashboard
  if (user) {
    redirect('/dashboard')
  }

  // Obtener carreras para mostrar en la landing
  const { data: careers } = await supabase
    .from('careers')
    .select('*, faculties(name)')
    .order('name')

  return <LandingPage careers={careers || []} />
}