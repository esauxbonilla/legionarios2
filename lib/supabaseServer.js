import { createClient } from "@supabase/supabase-js";

// OJO: este cliente usa la SERVICE ROLE KEY.
// Solo se importa dentro de app/api/**/route.js (código de servidor).
// Nunca lo importes en un componente que corra en el navegador.
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}
