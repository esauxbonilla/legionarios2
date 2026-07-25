import { createClient } from "@supabase/supabase-js";

// OJO: este cliente usa la SERVICE ROLE KEY.
// Solo se importa dentro de app/api/**/route.js (código de servidor).
// Nunca lo importes en un componente que corra en el navegador.
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false },
      global: {
        // Next parchea fetch y cachea las respuestas del servidor por defecto.
        // Sin no-store, el conteo del mapa se congela en el primer valor que
        // vio y los registros nuevos nunca aparecen (ni en local ni en Vercel).
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      },
    }
  );
}
