# AGENTS.md — Guía de trabajo para POPUPS · Portfolio

Este documento define cómo diseñamos, integramos y publicamos nuevos casos y landings dentro de `Somospopups/Portfolio`.

> **Protocolo obligatorio de entrega:** Antes de modificar o empaquetar cambios, leer completo [`PUBLICAR_CAMBIOS.md`](https://github.com/Somospopups/Asi-subimos-los-cambios/blob/main/PUBLICAR_CAMBIOS.md) en `Somospopups/Asi-subimos-los-cambios`. Las reglas de producto y arquitectura de este archivo mandan sobre el portfolio; aquel repositorio manda sobre el flujo de entrega con `PUBLICAR.bat`.

---

## 1. Cómo trabajamos (regla de oro)

- **El propietario trabaja con doble clic:** el agente realiza todo el trabajo técnico (diseño, código, optimización de assets, pruebas, commit, bundle y simulación) y entrega un ZIP listo para ejecutar `PUBLICAR.bat`.
- **Nunca** pedirle al propietario usar terminal, copiar archivos a mano, crear commits ni resolver conflictos.
- **Trabajar siempre desde el último `origin/main`:** ejecutar `git fetch origin main`, `git switch main`, `git reset --hard origin/main` antes de editar. Si el propietario acaba de publicar un cambio, verificar el SHA remoto antes de crear el siguiente bundle.
- **Una actualización = un commit limpio + un ZIP de un solo uso:**
  ```text
  actualizacion-<nombre>-<YYYY-MM-DD>/
  ├── PUBLICAR.bat
  ├── cambio-<nombre>-<YYYY-MM-DD>.bundle
  └── LEEME.txt
  ```
  - Identidad de commit por defecto: `Arena Agent <arena-agent@users.noreply.github.com>`.
  - Bundle incremental con prerrequisito (`git bundle create ... HEAD ^$BASE`) y verificado con `git bundle verify`.
  - `PUBLICAR.bat` derivado de `PLANTILLA_PUBLICAR.bat` (con saltos CRLF para Windows, `push` normal sin `--force`, detección de "ya publicado" con `git cherry` y verificación de SHA remoto con `git ls-remote`).
  - **Simular siempre en un clon limpio** antes de entregar el ZIP (extraer el ZIP real, `git fetch`, `git cherry`, `cherry-pick`, re-chequear idempotencia y correr todas las pruebas).
  - **Nunca afirmar que está publicado** hasta que el propietario ejecute `PUBLICAR.bat` y aparezca `PUBLICACION VERIFICADA`.

---

## 2. Identidad y estándares que POPUPS siempre mantiene

Cada proyecto tiene libertad creativa total en su estética, pero **todos** comparten la esencia y reglas comerciales de POPUPS:

### Marca, voz y propósito
- **Estudio:** POPUPS · Córdoba, Argentina.
- **Principio central:** *"Tecnología que hace aparecer tiempo"* · *"Funcional no alcanza. Tiene que entenderse."*
- **Tono:** español argentino/rioplatense natural, claro, humano y directo (*"contanos"*, *"tocá"*, *"tu equipo"*, *"hablemos"*). Cero humo corporativo ni jerga técnica innecesaria para el cliente final.

### Contacto comercial oficial
- **WhatsApp oficial:** `+54 9 351 766-9967` → `https://wa.me/5493517669967?text=...` (con mensaje prearmado contextualizado al proyecto).
- **Email oficial:** `somospopups@gmail.com`
- **Portfolio raíz (GitHub Pages):** `https://somospopups.github.io/Portfolio/`

### Reglas comerciales y de privacidad (no negociables)
1. **No exponer repositorios públicos de GitHub ni URLs internas/de staging** en las landings comerciales ni en fichas ya migradas a experiencia comercial, salvo que el propietario lo pida explícitamente.
2. **No mostrar nombres personales reales** (integrantes, clientes, usuarios de prueba) ni datos sensibles (DNI, teléfonos ajenos, mails internos) en capturas, demos o copy. Usar roles genéricos o ejemplos neutros.
3. **No inventar precios fijos:** salvo que el propietario defina tarifas explícitas, enfocar las modalidades/planes en alcances claros y derivar el presupuesto o demo a WhatsApp.
4. **No incluir detalles irrelevantes o descartados** que el propietario haya pedido omitir durante el diseño del producto.

---

## 3. Arquitectura híbrida: "Landing + Caso de estudio"

Cada proyecto puede (y debe) construirse por separado con una propuesta visual y narrativa propia (ejemplo de referencia ya implementado: `oficina-virtual/`). Sin embargo, **dentro del portfolio la landing y el caso de estudio son UNA sola página híbrida** — nunca dividir en dos destinos separados ("Ver landing" y "Ver caso").

### Estructura de archivos por proyecto migrado
```text
Portfolio/
├── index.html                  # Tarjeta del proyecto apunta directo a <slug>/
├── project.html                # Mantiene metadata + redirige ?project=<key> a <slug>/
├── assets/
│   └── <portada-limpia>        # Solo la portada usada en index.html (sin duplicar galería)
└── <slug>/                     # Ej: oficina-virtual/, appi/, bondi/, mi-amp/
    ├── index.html              # Build web liviano (0 data URIs pesados)
    └── assets/
        ├── og-preview.jpg      # Tarjeta Open Graph 1200x630 dedicada
        └── ...                 # Imágenes WebP y fuentes .woff2 locales
```

### Elementos puente que toda landing híbrida debe conservar
Aunque la estética, tipografía, paleta y layout cambien por completo de un proyecto a otro, toda landing integrada al portfolio mantiene estas 5 conexiones (adaptadas visualmente a su propio estilo):

1. **Vuelta visible al portfolio en la navegación:** enlace `← Volver a proyectos` apuntando a `../#proyectos` tanto en desktop como en el menú móvil.
2. **Numeración de caso en el Hero:** eyebrow o badge con el número del portfolio (ej. `CASO 06 · TRABAJO COLABORATIVO`).
3. **Bloque de Caso de estudio (`#caso`):** integrado de forma nativa al diseño de la landing con:
   - **El desafío y la solución** (problema real → qué construimos).
   - **Ficha rápida** de 4 datos clave (Tipo, Interacción/Alcance, Enfoque/Estética, Estado).
   - **Logros o funcionalidades clave** + chips de tecnologías.
4. **Pie de navegación "Siguiente caso" antes del `<footer>`:** replicando la continuidad de `project.html`:
   - Eyebrow `SIGUIENTE CASO · NN · CATEGORÍA`, título y breve descripción del proyecto siguiente.
   - Botón principal **`Ver siguiente caso ↗`** al proyecto siguiente (`../<next-slug>/` si ya tiene landing propia, o `../project.html?project=<next-key>`).
   - Acceso discreto al **caso anterior** (`← ANTERIOR · NN ...`) y botón **`← Todos los proyectos`** (`../#proyectos`).
5. **Conversión comercial y footer:** CTA principal hacia **WhatsApp (`5493517669967`)** / `somospopups@gmail.com` y enlace `← Portfolio POPUPS` (`../`) en el footer.

### Cómo conectar un nuevo caso híbrido en el repo
1. **En `index.html`:**
   - Actualizar la portada en `assets/` con una captura limpia y moderna (sin pantallas viejas de login ni datos sensibles) y ajustar su `object-position` si hace falta.
   - Mantener **un único enlace** en `.project-bottom`: `<a class="project-link" href="<slug>/">Ver caso completo ↗</a>`, coherente con el resto de las tarjetas.
2. **En `project.html`:**
   - Agregar `page: '<slug>/'` dentro del objeto `projects.<key>` (manteniendo `number`, `title` y `next` intactos para que el caso anterior renderice su pie *"Siguiente caso"* apuntando directo a `<slug>/`).
   - El redireccionamiento automático `if (projects[key] && projects[key].page) { location.replace(projects[key].page); }` garantiza que cualquier link viejo `project.html?project=<key>` caiga directo en la nueva landing híbrida.
   - Quitar enlaces a repositorios de GitHub si el proyecto pasa a formato comercial.
3. **En los casos híbridos vecinos (anterior y siguiente):**
   - Si el caso anterior o siguiente ya tiene su propia carpeta híbrida, actualizar sus enlaces `anterior` / `siguiente` para apuntar directo a `../<slug>/`.
4. **Limpieza:**
   - Eliminar de la raíz `/assets/` cualquier captura de galería que haya quedado duplicada dentro de `/<slug>/assets/`.
   - Actualizar `README.md` listando la nueva URL de GitHub Pages (`https://somospopups.github.io/Portfolio/<slug>/`).

---

## 4. Estándar visual, motion, rendimiento y SEO por landing

Cada landing que diseñemos debe cumplir este piso de calidad antes de empaquetarse:

- **Above-the-fold cuidado:** el Hero (título, bajada breve de 2 líneas, CTA principal y pieza visual protagonista) debe lucirse limpio y encuadrado desde la primera pantalla.
- **Copy conciso y escaneable:** evitar bloques densos; priorizar titulares con golpe, bajadas de 1–2 líneas y guías breves sobre los módulos interactivos.
- **Animaciones, motion graphics y parallax a 60 fps:** toda landing debe sentirse viva (entrada coreografiada del Hero, barra de progreso o indicador de scroll, parallax sutil/profundidad, micro-interacciones de cursor/hover, scroll-reveal con `IntersectionObserver`, transiciones suaves entre estados/tabs), **respetando siempre `@media (prefers-reduced-motion: reduce)`**.
- **Mobile-first / responsive real:** menú hamburguesa / drawer limpio en pantallas `< 960px`, grillas que no dejen huecos huérfanos y botones cómodos para pulgar.
- **Assets optimizados y locales:**
  - En producción (`/<slug>/`), **0 data URIs gigantes** dentro del HTML; alojar imágenes en `.webp` y tipografías en `.woff2` dentro de `/<slug>/assets/` (sin depender de CDNs externos que puedan fallar o ralentizar).
  - Si el propietario pide también una versión offline portable de 1 archivo para compartir fuera del portfolio, mantenerla fuera del repositorio `Portfolio` (solo en el workspace).
- **Open Graph y Twitter Cards listos para compartir:**
  - Generar una portada social dedicada `1200×630` (`/<slug>/assets/og-preview.jpg`).
  - Configurar `<link rel="canonical">`, `og:url`, `og:image`, `og:title`, `og:description`, `twitter:card` (`summary_large_image`) y `twitter:image` usando **URLs absolutas de GitHub Pages**:
    `https://somospopups.github.io/Portfolio/<slug>/assets/og-preview.jpg`.

---

## 5. Mapa actual del recorrido circular (01 → 07 → 01)

| # | Key (`project.html`) | Proyecto | Estado actual | Carpeta híbrida | Anterior → Siguiente |
|---|---|---|---|---|---|
| 01 | `appi` | APPI | Ficha `project.html?project=appi` | *(pendiente, ej. `appi/`)* | `07 mi-amp/` → `02 bondi` |
| 02 | `bondi` | Bondi | Ficha `project.html?project=bondi` | *(pendiente, ej. `bondi/`)* | `01 appi` → `03 sellos` |
| 03 | `sellos` | Mis Sellos | Ficha `project.html?project=sellos` | *(pendiente, ej. `mis-sellos/`)* | `02 bondi` → `04 tienda` |
| 04 | `tienda` | Mi-Tienda | Ficha `project.html?project=tienda` | *(pendiente, ej. `mi-tienda/`)* | `03 sellos` → `05 entrenador` |
| 05 | `entrenador` | Mi Entrenador | Ficha `project.html?project=entrenador` | *(pendiente, ej. `mi-entrenador/`)* | `04 tienda` → `06 oficina-virtual/` |
| 06 | `office` | Oficina Virtual | **Híbrido publicado** | **`oficina-virtual/`** | `05 entrenador` → `07 mi-amp/` |
| 07 | `audio` | MI AMP | **Híbrido publicado** | **`mi-amp/`** | `06 oficina-virtual/` → `01 appi` |

---

## 6. Checklist obligatorio antes de crear el ZIP

- [ ] Partí del último `origin/main` recién consultado (`git ls-remote` / `git fetch`).
- [ ] `git diff --check` sin advertencias y diff revisado (solo archivos de la tarea).
- [ ] Todos los `<script>` modificados pasan `node --check`.
- [ ] 100 % de las rutas locales (`src`, `href`, `data-full`, CSS `url(...)`, JS) existen en disco.
- [ ] La landing en `/<slug>/index.html` tiene 0 data URIs de imágenes/fuentes, Open Graph con URLs absolutas, `prefers-reduced-motion` y menú móvil funcional.
- [ ] Cero enlaces a repositorios privados/no deseados, cero nombres personales reales y contacto verificado (`5493517669967` / `somospopups@gmail.com`).
- [ ] Navegación circular verificada (`anterior → caso híbrido → siguiente` y `← Volver a proyectos`).
- [ ] `git bundle verify` aprobado y simulación completa en clon limpio (`fetch` + `git cherry` + `cherry-pick` + idempotencia + re-validación) aprobada.
- [ ] El ZIP contiene únicamente `<carpeta>/PUBLICAR.bat`, `<carpeta>/<bundle>.bundle` y `<carpeta>/LEEME.txt` (sin `.git`, cachés ni credenciales).
