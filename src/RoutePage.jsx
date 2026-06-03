import { useEffect } from 'react'
import { ArrowRight, CheckCircle2, Shield, Zap, Truck } from 'lucide-react'

const WA_BASE = 'https://wa.me/59898534165?text='

const ROUTES = {
  'fletes-montevideo-maldonado': {
    origen: 'Montevideo',
    destino: 'Maldonado',
    slug: 'fletes-montevideo-maldonado',
    title: 'Fletes Montevideo → Maldonado | Movantia',
    desc: 'Encontrá flete entre Montevideo y Maldonado en minutos. Pago garantizado con escrow. Camiones verificados para todo tipo de carga.',
    keywords: 'flete Montevideo Maldonado, transporte Maldonado Montevideo, carga Maldonado',
    tiempoEstimado: '1h 45min',
    distancia: '140 km',
    precioEstimado: 'USD 90–180',
    retorno: true,
  },
  'fletes-montevideo-rivera': {
    origen: 'Montevideo',
    destino: 'Rivera',
    slug: 'fletes-montevideo-rivera',
    title: 'Fletes Montevideo → Rivera | Movantia',
    desc: 'Flete de Montevideo a Rivera con transportistas verificados. Match en horas. Pago seguro con escrow. Sin pagar el camión completo.',
    keywords: 'flete Montevideo Rivera, transporte Rivera Uruguay, carga norte Uruguay',
    tiempoEstimado: '4h 30min',
    distancia: '390 km',
    precioEstimado: 'USD 200–380',
    retorno: true,
  },
  'fletes-montevideo-paysandu': {
    origen: 'Montevideo',
    destino: 'Paysandú',
    slug: 'fletes-montevideo-paysandu',
    title: 'Fletes Montevideo → Paysandú | Movantia',
    desc: 'Transportá carga de Montevideo a Paysandú sin pagar flete completo. Conectamos tu carga con camiones que ya van hacia el litoral.',
    keywords: 'flete Montevideo Paysandú, transporte litoral Uruguay, carga Paysandú',
    tiempoEstimado: '3h 30min',
    distancia: '378 km',
    precioEstimado: 'USD 180–340',
    retorno: true,
  },
  'fletes-montevideo-colonia': {
    origen: 'Montevideo',
    destino: 'Colonia',
    slug: 'fletes-montevideo-colonia',
    title: 'Fletes Montevideo → Colonia del Sacramento | Movantia',
    desc: 'Flete entre Montevideo y Colonia del Sacramento. Match rápido, transportistas verificados y pago con escrow garantizado.',
    keywords: 'flete Montevideo Colonia, transporte Colonia Sacramento, carga Colonia',
    tiempoEstimado: '2h 30min',
    distancia: '177 km',
    precioEstimado: 'USD 100–200',
    retorno: true,
  },
  'fletes-montevideo-punta-del-este': {
    origen: 'Montevideo',
    destino: 'Punta del Este',
    slug: 'fletes-montevideo-punta-del-este',
    title: 'Fletes Montevideo → Punta del Este | Movantia',
    desc: 'Transportá carga entre Montevideo y Punta del Este. Camiones con ruta planificada, match en minutos y pago asegurado.',
    keywords: 'flete Montevideo Punta del Este, transporte Maldonado, carga costa',
    tiempoEstimado: '1h 30min',
    distancia: '139 km',
    precioEstimado: 'USD 90–170',
    retorno: true,
  },
  'mudanzas-montevideo': {
    origen: 'Montevideo',
    destino: null,
    slug: 'mudanzas-montevideo',
    title: 'Mudanzas en Montevideo | Cotizaciones en minutos — Movantia',
    desc: 'Publicá tu mudanza en Movantia y recibí cotizaciones de transportistas verificados en Montevideo. Pago seguro, sin sorpresas.',
    keywords: 'mudanzas Montevideo, flete mudanza Montevideo, empresa mudanzas MVD',
    tiempoEstimado: null,
    distancia: null,
    precioEstimado: 'Según volumen',
    retorno: false,
    express: true,
  },
  'flete-express-uruguay': {
    origen: 'Uruguay',
    destino: null,
    slug: 'flete-express-uruguay',
    title: 'Flete Express Uruguay | Cotizaciones al instante — Movantia',
    desc: 'Necesitás mover algo urgente en Uruguay. Publicá tu pedido y recibí cotizaciones de camionetas y vehículos disponibles en tu zona.',
    keywords: 'flete express Uruguay, transporte urgente Uruguay, flete rápido',
    tiempoEstimado: null,
    distancia: null,
    precioEstimado: 'Según pedido',
    retorno: false,
    express: true,
  },
}

export default function RoutePage({ slug }) {
  const route = ROUTES[slug]

  useEffect(() => {
    if (route) {
      document.title = route.title
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', route.desc)
    }
    window.scrollTo(0, 0)
  }, [slug, route])

  if (!route) return null

  const isExpress = route.express
  const waMsg = encodeURIComponent(
    isExpress
      ? `Hola, necesito un flete express — ${route.origen}`
      : `Hola, necesito un flete ${route.origen} → ${route.destino}`
  )
  const waTransp = encodeURIComponent(
    `Hola, soy transportista y quiero registrarme en Movantia`
  )

  return (
    <div style={{ background: '#07090F', minHeight: '100vh', color: '#E8EDF5' }}>

      {/* Header */}
      <header className="v2-header">
        <div className="v2-header-inner container">
          <a href="/" className="brand-link" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
            <span className="brand-name" style={{ fontSize:'18px', fontWeight:700, color:'#D4A843' }}>MOVANTIA</span>
          </a>
          <a href={`${WA_BASE}${waMsg}`} className="button button-primary" target="_blank" rel="noopener">
            {isExpress ? 'Pedir cotización' : 'Necesito este flete'}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="container" style={{ paddingTop:'80px', paddingBottom:'48px' }}>
        <p className="section-eyebrow" style={{ marginBottom:'12px' }}>
          {isExpress ? 'Flete express · Uruguay' : `Ruta activa · ${route.origen} → ${route.destino}`}
        </p>
        <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:800, lineHeight:1.15, marginBottom:'20px', maxWidth:'700px' }}>
          {isExpress
            ? route.destino
              ? `Fletes en ${route.origen}`
              : `Flete express en ${route.origen}`
            : <>Fletes {route.origen}<br /><span style={{ color:'#D4A843' }}>→ {route.destino}</span></>
          }
        </h1>
        <p style={{ fontSize:'18px', color:'#9AA3B5', maxWidth:'560px', lineHeight:1.6, marginBottom:'32px' }}>
          {route.desc}
        </p>

        {/* Stats */}
        {!isExpress && (
          <div className="v2-hero-stats" style={{ marginBottom:'32px' }}>
            <div className="v2-stat"><strong>{route.distancia}</strong><span>Distancia</span></div>
            <div className="v2-stat-div" />
            <div className="v2-stat"><strong>{route.tiempoEstimado}</strong><span>Tiempo estimado</span></div>
            <div className="v2-stat-div" />
            <div className="v2-stat"><strong>{route.precioEstimado}</strong><span>Precio orientativo</span></div>
          </div>
        )}

        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
          <a href={`${WA_BASE}${waMsg}`} className="button button-primary" target="_blank" rel="noopener">
            {isExpress ? 'Publicar pedido' : 'Quiero este flete'} <ArrowRight size={17} />
          </a>
          <a href={`${WA_BASE}${waTransp}`} className="button button-secondary" target="_blank" rel="noopener">
            Soy transportista
          </a>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="container section-block">
        <p className="section-eyebrow">Cómo funciona</p>
        <h2 style={{ fontSize:'24px', fontWeight:700, marginBottom:'32px' }}>
          {isExpress ? 'Tres pasos y listo' : `Tu carga de ${route.origen} a ${route.destino}`}
        </h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'16px', maxWidth:'560px' }}>
          {(isExpress ? [
            { icon: <Zap size={20}/>, title:'Publicás tu pedido', desc:'Describís qué necesitás mover, dónde y cuándo. Dos minutos.' },
            { icon: <Truck size={20}/>, title:'Recibís cotizaciones', desc:'Transportistas de tu zona ven el pedido y te mandan su precio.' },
            { icon: <Shield size={20}/>, title:'Elegís y cobrás con escrow', desc:'Pagás seguro. El dinero solo se libera cuando recibís todo bien.' },
          ] : [
            { icon: <Zap size={20}/>, title:'Publicás tu carga', desc:`Indicás que necesitás mover mercadería de ${route.origen} a ${route.destino}.` },
            { icon: <Truck size={20}/>, title:'Match con camión en ruta', desc:`Te conectamos con un transportista que ya tiene planificado ese trayecto.` },
            { icon: <Shield size={20}/>, title:'Pagás con escrow', desc:'El dinero queda retenido hasta confirmar la entrega. Cero riesgo.' },
          ]).map((s, i) => (
            <div key={i} style={{ display:'flex', gap:'16px', alignItems:'flex-start', background:'#0D1018', borderRadius:'10px', padding:'18px' }}>
              <div style={{ color:'#D4A843', marginTop:'2px', flexShrink:0 }}>{s.icon}</div>
              <div>
                <p style={{ fontWeight:700, marginBottom:'4px' }}>{s.title}</p>
                <p style={{ color:'#8695AE', fontSize:'14px', margin:0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Por qué Movantia */}
      <section className="container section-block">
        <p className="section-eyebrow">Por qué Movantia</p>
        <h2 style={{ fontSize:'24px', fontWeight:700, marginBottom:'28px' }}>Sin las molestias del flete tradicional</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'14px' }}>
          {[
            { icon:<CheckCircle2 size={18}/>, label:'Pago garantizado con escrow' },
            { icon:<CheckCircle2 size={18}/>, label:'Transportistas verificados' },
            { icon:<CheckCircle2 size={18}/>, label:'Sin pagar el camión completo' },
            { icon:<CheckCircle2 size={18}/>, label:'Match en minutos u horas' },
            { icon:<CheckCircle2 size={18}/>, label:'Remito digital incluido' },
            { icon:<CheckCircle2 size={18}/>, label:'Sin contratos ni suscripción' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', gap:'10px', alignItems:'center', background:'#0D1018', borderRadius:'8px', padding:'14px' }}>
              <span style={{ color:'#00D68F', flexShrink:0 }}>{item.icon}</span>
              <span style={{ fontSize:'14px' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="container contact-section" style={{ marginBottom:'64px' }}>
        <h2>{isExpress ? '¿Necesitás mover algo?' : `¿Tenés carga para ${route.destino}?`}</h2>
        <p style={{ color:'#8695AE', marginBottom:'24px' }}>
          {isExpress
            ? 'Publicá tu pedido y recibí cotizaciones en minutos. Es gratis hasta que confirmás.'
            : `Publicá tu carga y te matcheamos con un camión que ya va hacia ${route.destino}.`
          }
        </p>
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', justifyContent:'center' }}>
          <a href={`${WA_BASE}${waMsg}`} className="button button-primary" target="_blank" rel="noopener">
            {isExpress ? 'Publicar pedido' : `Quiero flete a ${route.destino}`} <ArrowRight size={17}/>
          </a>
          {!isExpress && route.retorno && (
            <a href={`${WA_BASE}${waTransp}`} className="button button-secondary" target="_blank" rel="noopener">
              Soy transportista en esta ruta
            </a>
          )}
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© 2025 Movantia. Fill Empty Miles.</p>
          <p><a href="/" style={{ color:'#D4A843' }}>← Volver al inicio</a></p>
        </div>
      </footer>
    </div>
  )
}

export { ROUTES }
