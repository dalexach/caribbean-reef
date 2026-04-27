# Caribbean Reef Adventures

Sitio web de un operador turístico ficticio en San Andrés (Colombia),
desarrollado con **HTML, CSS y JavaScript puro** (sin frameworks ni build tools).

Proyecto académico — Entrega Final.

## Páginas

| Página | Archivo | Descripción |
|---|---|---|
| Home | `index.html` | Landing con hero, métricas y servicios destacados. |
| Servicios | `services.html` | Catálogo con cards, detalle expandible y favoritos. |
| Acerca de | `about.html` | Historia, valores y equipo. |
| Contacto | `contact.html` | Formulario con validaciones y datos de contacto. |
| Gestión | `admin-services.html` | Mini CRUD (crear, eliminar y restaurar servicios con `localStorage`). |

## Estructura del proyecto

```
caribbean-reef/
├── index.html
├── about.html
├── services.html
├── contact.html
├── admin-services.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js              # Render de catálogo, favoritos y detalle
│   │   ├── services-data.js     # Respaldo local de datos
│   │   ├── contact.js           # Validaciones del formulario
│   │   └── admin-services.js    # Mini CRUD con localStorage
│   ├── data/
│   │   └── services.json        # Fuente principal de servicios (fetch)
│   └── docs/
│       └── explicacion-tecnica.md
├── .gitignore
├── vercel.json
└── README.md
```

## Funcionalidades

- Renderizado dinámico de servicios desde `services.json` (con `services-data.js` como respaldo).
- Favoritos persistentes con `localStorage`.
- Vista de detalle expandible dentro de la misma página.
- Formulario de contacto con validaciones en JavaScript.
- Mini CRUD de servicios en la página de Gestión: crear, eliminar (incluso servicios base) y restaurar el catálogo original.
- Sincronización entre Gestión y Servicios: los cambios hechos en `admin-services.html` se reflejan automáticamente en `services.html`.

## Cómo ejecutar localmente

Como el proyecto usa `fetch` para cargar `services.json`, es necesario servirlo
desde un servidor HTTP (abrir con doble clic funcionará igual gracias al
respaldo en `services-data.js`, pero lo recomendado es usar un servidor).

Opciones:

```bash
# Con Python 3
python3 -m http.server 8000

# O con Node (si tienes npx)
npx serve .
```

Luego abre `http://localhost:8000` en el navegador.

## Despliegue en Vercel

Sí, este proyecto se puede desplegar en Vercel sin ninguna configuración
adicional, ya que es un sitio **estático** (solo HTML, CSS y JS).

### Opción 1 — Desde la interfaz web
1. Sube el repositorio a GitHub.
2. Entra a [vercel.com](https://vercel.com) e importa el repositorio.
3. En la configuración del proyecto:
   - **Framework Preset:** `Other` (o `Static`).
   - **Build Command:** dejar vacío.
   - **Output Directory:** dejar vacío (usa la raíz).
4. Haz clic en **Deploy**.

### Opción 2 — Desde la CLI
```bash
npm i -g vercel
vercel
```

El archivo `vercel.json` ya incluye la configuración recomendada
(`cleanUrls: true`) para que las URLs se vean como `/about` en lugar de
`/about.html`.

## Integrantes
```
ELIU SILVERA OVIEDO
DANIELA ALEXANDRA CHAMORRO GUERRERO
JUAN PABLO BETANCUR FIGUEROA
SANTIAGO AVELLANEDA TAPIA
DUBAN FELIPE BELTRÁN MENDOZA
```
