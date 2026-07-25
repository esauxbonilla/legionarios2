# Legionarios — Pasaporte Legionario — Guía paso a paso

Todo el código ya está escrito. Tu trabajo es: crear cuentas, pegar llaves, correr comandos. Sigue el orden exacto.

---

## Paso 1 — Crear cuenta y proyecto en Supabase

1. Ve a https://supabase.com → crea cuenta gratis → "New project".
2. Ponle nombre `legionarios`, elige una contraseña de base de datos (guárdala) y una región cercana (US East suele ir bien para México).
3. Cuando termine de aprovisionar, ve a **SQL Editor** (menú izquierdo) → pega el contenido del archivo `supabase.sql` de este proyecto → "Run". Esto crea la tabla.
4. Ve a **Project Settings → API**. Vas a necesitar dos valores:
   - `Project URL` (algo como `https://xxxx.supabase.co`)
   - `service_role` key (en la sección "Project API keys" — es la key secreta, NO la `anon` pública)

Guarda esos dos valores, los usas en el Paso 3.

---

## Paso 2 — Instalar Node.js (si no lo tienes)

1. Ve a https://nodejs.org → instala la versión LTS.
2. Verifica en tu terminal:
   ```bash
   node -v
   npm -v
   ```
   Si te devuelve números de versión, estás listo.

---

## Paso 3 — Preparar el proyecto localmente

1. Descarga y descomprime el zip que te compartí (`legionarios.zip`).
2. Abre una terminal dentro de esa carpeta.
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
5. Abre `.env.local` en un editor de texto y reemplaza:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
   ```
   con los valores reales que copiaste en el Paso 1.

---

## Paso 4 — Probar en local

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador. Deberías ver el form. Llena un registro de prueba y envíalo.

**Cómo confirmar que funcionó:**
- En Supabase, ve a **Table Editor → legionarios**. Debe aparecer tu registro.
- La página debe redirigirte a `/gracias?n=1` mostrando "Eres el Legionario #1".
- Si recargas la página principal, el JSON de abajo del form (placeholder del mapa) debe mostrar `{ "TU_ESTADO": 1 }`.

Si algo falla, el error más común es que copiaste mal alguna key en `.env.local` — revísalo primero.

---

## Paso 5 — Conseguir el SVG de México y conectarlo

1. Busca un SVG de "mapa de México por estados" en Wikimedia Commons (dominio público / licencia libre) — por ejemplo buscando "Mexico states blank map svg".
2. Ábrelo con un editor de texto. Cada estado debe ser un `<path>`. Si el SVG trae IDs tipo `id="MX-CMX"`, vas a necesitar mapearlos a los códigos de `lib/estados.js` (CDMX, JAL, NL, etc.) — es trabajo manual de una sola vez, pero solo 32 líneas.
3. Guarda el archivo final como `public/mexico.svg` o conviértelo en un componente React (`components/MapaMexico.js`) donde cada `<path>` reciba `data-estado="XXX"`.
4. En `app/page.js` ya dejé el cálculo de `intensidad(codigo)` (0 a 1) y un comentario con el ejemplo exacto de cómo aplicarlo al `fill` y al `drop-shadow` de cada path. Solo pega tus paths ahí.

Este es el único paso manual/creativo real del proyecto — todo lo demás es conectar cables.

---

## Paso 6 — Deploy a Vercel

1. Sube el proyecto a GitHub (crea un repo nuevo, `git init`, `git add .`, `git commit -m "init"`, `git push`).
2. Ve a https://vercel.com → "Add New Project" → importa ese repo de GitHub.
3. En la pantalla de configuración, antes de darle deploy, agrega las variables de entorno (mismo nombre y valor que tu `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Dale "Deploy". En ~1 minuto tienes una URL pública tipo `legionarios.vercel.app`.
5. Para conectar tu dominio propio: **Project → Settings → Domains** → agrega el dominio y sigue las instrucciones de DNS (Vercel te da los registros exactos que debes poner en tu proveedor de dominio, ej. GoDaddy/Namecheap).

---

## Paso 7 — Probar en producción

Repite el Paso 4 pero contra la URL real de Vercel. Haz un registro real, confirma que llegue a Supabase, confirma que el mapa se actualice.

---

## Paso 8 — Migrar a Klaviyo (dentro de ~5 días)

Esto NO se hace en el código, se hace a mano cuando toque:

1. En Supabase: **Table Editor → legionarios → Export** (botón arriba a la derecha) → descarga el CSV.
2. En Klaviyo: **Lists → Create List** → nómbrala "Legionarios Waitlist" → **Import** → sube el CSV.
3. Klaviyo te deja mapear cada columna del CSV a una propiedad de perfil (nombre, teléfono, estado, talla, prenda, instagram) — incluso crear propiedades custom en el mismo paso de mapeo.
4. Desde ahí arma en el editor visual de Klaviyo (sin código): flujo de bienvenida, segmento de "acceso 24h antes", etc.
5. Si siguen entrando registros nuevos después del primer import, repites el export/import cuando quieras actualizar la lista — no hace falta automatizarlo a menos que el volumen lo amerite.

---

## Notas importantes

- **Nunca** subas `.env.local` a GitHub (ya está en `.gitignore`).
- La `service_role` key de Supabase es secreta — solo vive en variables de entorno del servidor (Vercel), nunca en código del navegador.
- El checkbox de consentimiento es obligatorio: sin él, el backend rechaza el registro (`/api/registro` lo valida). Es tu base legal para poder subir la lista a Klaviyo después.
- El mapa se cachea 8 segundos en el servidor para no golpear la base en cada visita si hay mucho tráfico — puedes ajustar `CACHE_MS` en `app/api/mapa/route.js`.
