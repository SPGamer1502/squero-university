'use client'
import Link from 'next/link'

// Datos completos de las 23 carreras (se pueden reemplazar por los de Supabase cuando funcione)
const ALL_CAREERS = [
  { id: 1, name: 'Ingeniería de Sistemas', faculty: 'Facultad de Ingeniería' },
  { id: 2, name: 'Ingeniería Civil', faculty: 'Facultad de Ingeniería' },
  { id: 3, name: 'Ingeniería Mecánica', faculty: 'Facultad de Ingeniería' },
  { id: 4, name: 'Ingeniería Electrónica', faculty: 'Facultad de Ingeniería' },
  { id: 5, name: 'Ingeniería de Minas', faculty: 'Facultad de Ingeniería' },
  { id: 6, name: 'Ingeniería Química', faculty: 'Facultad de Ingeniería' },
  { id: 7, name: 'Ingeniería Agronómica', faculty: 'Facultad de Ingeniería' },
  { id: 8, name: 'Medicina Humana', faculty: 'Facultad de Ciencias de la Salud' },
  { id: 9, name: 'Odontología', faculty: 'Facultad de Ciencias de la Salud' },
  { id: 10, name: 'Farmacia y Bioquímica', faculty: 'Facultad de Ciencias de la Salud' },
  { id: 11, name: 'Enfermería', faculty: 'Facultad de Ciencias de la Salud' },
  { id: 12, name: 'Obstetricia', faculty: 'Facultad de Ciencias de la Salud' },
  { id: 13, name: 'Psicología', faculty: 'Facultad de Ciencias de la Salud' },
  { id: 14, name: 'Contabilidad', faculty: 'Facultad de Ciencias Económicas' },
  { id: 15, name: 'Administración', faculty: 'Facultad de Ciencias Económicas' },
  { id: 16, name: 'Economía', faculty: 'Facultad de Ciencias Económicas' },
  { id: 17, name: 'Derecho', faculty: 'Facultad de Derecho' },
  { id: 18, name: 'Educación Primaria', faculty: 'Facultad de Educación' },
  { id: 19, name: 'Educación Secundaria', faculty: 'Facultad de Educación' },
  { id: 20, name: 'Biología', faculty: 'Facultad de Ciencias Biológicas' },
  { id: 21, name: 'Trabajo Social', faculty: 'Facultad de Ciencias Sociales' },
  { id: 22, name: 'Sociología', faculty: 'Facultad de Ciencias Sociales' },
  { id: 23, name: 'Comunicación Social', faculty: 'Facultad de Ciencias Sociales' },
];

export default function LandingPage({ careers }: { careers?: any[] }) {
  const displayCareers = careers && careers.length > 0 ? careers : ALL_CAREERS;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#2d3748' }}>
      {/* ========== NAVBAR ========== */}
      <nav style={{
        backgroundColor: '#1a202c',
        padding: '0 2rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: 42, height: 42,
            background: 'linear-gradient(135deg, #718096, #4a5568)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: 'white',
            fontWeight: 700,
          }}>
            SU
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>SqueroUniversity</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Excelencia Académica</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#carreras" style={{ color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Carreras</a>
          <a href="#nosotros" style={{ color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Nosotros</a>
          <Link href="/login" style={{
            backgroundColor: '#4a5568',
            color: 'white',
            padding: '10px 24px',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: 14,
            transition: 'background 0.2s',
          }}>
            Aula Virtual
          </Link>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section style={{
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #1a202c 100%)',
        color: 'white',
        padding: '8rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-1px', lineHeight: 1.2 }}>
            Bienvenido a <span style={{ color: '#a0aec0' }}>SqueroUniversity</span>
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Formamos profesionales líderes con valores y excelencia académica. Descubre nuestras 23 carreras.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{
              backgroundColor: '#4a5568',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}>
              Ingresar al Aula Virtual
            </Link>
            <a href="#carreras" style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.5)',
              transition: 'background 0.2s',
            }}>
              Ver carreras
            </a>
          </div>
        </div>
      </section>

      {/* ========== CARRERAS ========== */}
      <section id="carreras" style={{ padding: '5rem 2rem', backgroundColor: '#f7fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a202c', marginBottom: '1rem' }}>
              Nuestras Carreras
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
              Programas académicos diseñados para el éxito profesional.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {displayCareers.map((career: any) => {
              const facultyName = career.faculty || career.faculties?.name || career.faculties?.[0]?.name || '';
              return (
                <div key={career.id} style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: '2rem 1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      backgroundColor: '#e2e8f0',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      color: '#2d3748',
                      flexShrink: 0,
                    }}>
                      📚
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: '#718096', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                        {facultyName}
                      </p>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a202c', marginBottom: 8, lineHeight: 1.3 }}>
                        {career.name}
                      </h3>
                      <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.5 }}>
                        Plan de estudios actualizado con estándares internacionales.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== CARACTERÍSTICAS ========== */}
      <section id="nosotros" style={{ padding: '5rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a202c', marginBottom: '1rem' }}>
            ¿Por qué elegir SqueroU?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Nuestra plataforma integra lo mejor de la tecnología educativa.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2.5rem',
          }}>
            {[
              { icon: '🎓', title: 'Excelencia', desc: 'Docentes PhD y programas acreditados internacionalmente.' },
              { icon: '💻', title: 'Virtual 24/7', desc: 'Accede a tus cursos, tareas y exámenes desde cualquier lugar.' },
              { icon: '🤝', title: 'Empleabilidad', desc: 'Bolsa de trabajo con más de 500 empresas aliadas.' },
              { icon: '🌍', title: 'Movilidad', desc: 'Intercambios con universidades de 20 países.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 48,
                  marginBottom: '1.5rem',
                  backgroundColor: '#f7fafc',
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a202c', marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{
        backgroundColor: '#1a202c',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center',
        fontSize: 14,
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Inicio</a>
            <a href="#carreras" style={{ color: 'white', textDecoration: 'none' }}>Carreras</a>
            <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>Aula Virtual</Link>
          </div>
          <p style={{ marginBottom: 0.5 }}>© 2026 SqueroUniversity – Todos los derechos reservados</p>
          <p style={{ opacity: 0.7 }}>Universidad Nacional San Luis Gonzaga – Ica, Perú</p>
        </div>
      </footer>
    </div>
  )
}