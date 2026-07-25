# Rediseño LEGIONARIOS — cómo pegarlo en tu repo

Todo esto va sobre `esauxbonilla/legionarios2` (rama `main`). Copia y pega respetando las rutas.

## Archivos

| Archivo de esta carpeta | Va en tu repo | Acción |
| --- | --- | --- |
| `app/layout.js` | `app/layout.js` | **reemplaza** (ahora carga Cinzel + JetBrains Mono con `next/font`) |
| `app/globals.css` | `app/globals.css` | **nuevo** (resets + animaciones) |
| `app/page.js` | `app/page.js` | **reemplaza** (landing rediseñada) |
| `app/gracias/page.js` | `app/gracias/page.js` | **reemplaza** (carta Pasaporte Fundador) |
| `public/casco.png` | `public/casco.png` | **nuevo** (yelmo) |
| `public/qr-whatsapp.png` | `public/qr-whatsapp.png` | **nuevo** (QR del grupo) |
| `app/api/mapa/route.js` | `app/api/mapa/route.js` | **reemplaza** (agrega `ultimos` para el feed) |
| `components/MapaMexico.js` | `components/MapaMexico.js` | **reemplaza** (paleta nueva + estado seleccionado) |
| `lib/tiempo.js` | `lib/tiempo.js` | **nuevo** (helper "hace 2 min") |

No se toca: `lib/estados.js`, `lib/estadosPaths.js`, `lib/supabaseServer.js`, `app/api/registro/route.js`, `supabase.sql`, variables de entorno.

## Pasos

```bash
# 1. copia los archivos encima
# 2. prueba en local
npm run dev        # http://localhost:3000

# 3. si todo bien, push
git add .
git commit -m "rediseño landing: mapa protagonista, ranking y feed en vivo"
git push
```

Vercel redeploya solo en ~1 minuto.

## Qué revisar en local antes del push

- Las fuentes cargan (títulos en Cinzel, datos en mono).
- El mapa pinta y al tocar un estado se selecciona en el `<select>`.
- El form manda y te lleva a `/gracias?n=1&e=CDMX` con tu número.
- La columna "Últimos registros" muestra los registros reales de Supabase.
- Móvil: en un viewport de ~390px todo baja a una columna.

## Detalles que quizá quieras cambiar

En `app/page.js`, arriba del archivo:

```js
const CUPO_TOTAL = 2000;      // los "cupos libres" se calculan con esto
const FECHA_DROP = "10 ago 2026";
```

El mapa se recarga solo cada 30 s (`setInterval` en el `useEffect`). Si te preocupa el tráfico, súbelo a 60000 — el server ya cachea 8 s por su lado.

## ⚠ Obligatorio antes del push

En `app/gracias/page.js`, línea ~10:

```js
const URL_WHATSAPP = "https://chat.whatsapp.com/XXXXXXXXXXXXXXX"; // ← pega tu invitación real
```

Ese es el link al que lleva el QR cuando lo tocan desde el celular (nadie puede escanear su propia pantalla). Si lo dejas con las X, el botón principal de la página no sirve.

Ahí mismo puedes cambiar `DROP`, `ACCESO` y `FECHA_DROP`.

## Pendientes reales (no son bugs)

1. **`/privacidad` no existe.** El checkbox linkea ahí. Crea `app/privacidad/page.js` con tu aviso o el link da 404 — y ese consentimiento es tu base legal para subir la lista a Klaviyo después.
2. **La foto de campaña es un placeholder.** En `app/page.js`, dentro del bloque `#registro`, hay un `div` con textura rayada marcado con un comentario: cámbialo por la foto real de Bastián (horizontal 3:2, `next/image`).
3. **Falta la foto de producto / hoodie** si quieres una sección más de producto antes del form.
