/* ============================================================================
   POPUPS · Catálogo de Páginas Web a Medida (fuente única de verdad)
   ----------------------------------------------------------------------------
   Para sumar una nueva web creada por POPUPS:
   1. Guardá una captura (1200x740 recomendado) en assets/<nombre>-shot.png
   2. Agregá un objeto a window.POPUPS_WEBS abajo.
   3. Automáticamente aparece en:
      - La portada del Portfolio (index.html#webs-a-medida)
      - El catálogo completo (webs-a-medida/index.html) con filtro por rubro.
   Si la web no tiene página de caso propia, dejá caseUrl: null y la tarjeta
   ofrecerá el acceso directo a la web en vivo.
   ============================================================================ */
window.POPUPS_WEBS = [
  {
    id: 'anton',
    number: '01',
    name: 'Antón · Cocina de Barrio',
    category: 'Gastronomía',
    location: 'Alta Córdoba, Córdoba',
    year: '2026',
    url: 'https://anton-cocinadebarrio.netlify.app/',
    displayUrl: 'anton-cocinadebarrio.netlify.app',
    caseUrl: 'anton/',
    image: 'assets/anton-shot.png',
    tagline: 'Pizza de barrio. Producto tope de gama.',
    summary: 'Web interactiva con pizza 3D giratoria, historia visual de la masa madre, armado paso a paso en 8 momentos y cuatro canales de venta directos a WhatsApp sin comisiones.',
    tags: ['Pizza 3D', 'Armado 8 pasos', '4 canales', 'WhatsApp 0%'],
    highlight: '0% comisión · Take away, En casa & B2B',
    accent: '#2D6117',
    featured: true
  }
];
