import Link from 'next/link'

export default function LandingPage({ careers }: { careers: any[] }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#2d3748' }}>
      {/* ========== NAVBAR ========== */}
      <nav style={{
        backgroundColor: '#1a202c',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 38, height: 38,
            backgroundColor: '#718096',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: 'white',
          }}>🎓</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>SqueroUniversity</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Institución de Educación Superior</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="#carreras" className="landing-nav-link">Carreras</Link>
          <Link href="#nosotros" className="landing-nav-link">Nosotros</Link>
          <Link href="/login" className="btn btn-primary" style={{ backgroundColor: '#2d3748', color: 'white', padding: '8px 18px', borderRadius: 7, textDecoration: 'none', fontWeight: 600 }}>
            Aula Virtual
          </Link>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section style={{
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        color: 'white',
        padding: '6rem 2rem',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.5px' }}>
          Bienvenido a SqueroUniversity
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
          Formamos profesionales líderes con valores y excelencia académica. Descubre nuestras 23 carreras.
        </p>
        <Link href="/login" className="btn btn-primary" style={{
          backgroundColor: '#4a5568',
          color: 'white',
          padding: '12px 28px',
          borderRadius: 7,
          fontSize: 16,
          fontWeight: 600,
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          Ingresar al Aula Virtual
        </Link>
      </section>

      {/* ========== CARRERAS ========== */}
      <section id="carreras" style={{ padding: '4rem 2rem', backgroundColor: '#f7fafc' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, color: '#2d3748', marginBottom: '2rem' }}>
          Nuestras Carreras
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          {careers.map((career: any) => (
            <div key={career.id} style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              transition: 'box-shadow 0.2s',
            }}>
              <div style={{ fontSize: 14, color: '#718096', marginBottom: 0.5 }}>
                {career.faculties?.name || 'Facultad'}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2d3748', marginBottom: 0.5 }}>
                {career.name}
              </h3>
              <p style={{ fontSize: 13, color: '#4a5568' }}>
                Plan de estudios actualizado con estándares internacionales.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== CARACTERÍSTICAS ========== */}
      <section id="nosotros" style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, color: '#2d3748', marginBottom: '2rem' }}>
          ¿Por qué elegir SqueroU?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {[
            { icon: '🎓', title: 'Excelencia Académica', desc: 'Docentes altamente calificados y plana de investigación.' },
            { icon: '💻', title: 'Aula Virtual 24/7', desc: 'Accede a tus cursos, tareas y exámenes desde cualquier lugar.' },
            { icon: '🤝', title: 'Bolsa de Trabajo', desc: 'Convenios con empresas líderes para prácticas pre-profesionales.' },
            { icon: '🌍', title: 'Movilidad Internacional', desc: 'Programas de intercambio con universidades de todo el mundo.' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2d3748', marginBottom: 0.5 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#4a5568' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{
        backgroundColor: '#1a202c',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        fontSize: 14,
      }}>
        <p style={{ marginBottom: 0.5 }}>© 2026 SqueroUniversity – Todos los derechos reservados</p>
        <p style={{ opacity: 0.7 }}>Universidad Nacional San Luis Gonzaga – Ica, Perú</p>
      </footer>
    </div>
  )
}