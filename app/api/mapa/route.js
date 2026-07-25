import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";

// Cache en memoria simple (vive mientras la función serverless esté "caliente").
// Evita pegarle a la base en cada carga de página si hay mucho tráfico.
let cache = { data: null, ts: 0 };
const CACHE_MS = 8000;

const ULTIMOS = 6; // cuántos registros recientes devolvemos para el feed en vivo

export async function GET() {
  const now = Date.now();
  if (cache.data && now - cache.ts < CACHE_MS) {
    return NextResponse.json(cache.data);
  }

  const supabase = supabaseServer();

  const [conteoRes, ultimosRes] = await Promise.all([
    supabase.from("legionarios").select("estado"),
    supabase
      .from("legionarios")
      .select("id, estado, created_at")
      .order("created_at", { ascending: false })
      .limit(ULTIMOS),
  ]);

  if (conteoRes.error) {
    return NextResponse.json({ error: conteoRes.error.message }, { status: 500 });
  }

  const data = conteoRes.data;
  const conteo = {};
  for (const row of data) {
    conteo[row.estado] = (conteo[row.estado] || 0) + 1;
  }

  const total = data.length;
  const estadosConquistados = Object.keys(conteo).length;
  let estadoLider = null;
  let max = 0;
  for (const [estado, count] of Object.entries(conteo)) {
    if (count > max) {
      max = count;
      estadoLider = estado;
    }
  }

  // Feed "últimos registros". Si la query falla, mandamos lista vacía:
  // el front simplemente no pinta la columna.
  const ultimos = (ultimosRes.data || []).map((row) => ({
    numero: row.id,
    estado: row.estado,
    created_at: row.created_at,
  }));

  const resultado = {
    conteoPorEstado: conteo, // { "CDMX": 214, "JAL": 172, ... }
    total,
    estadosConquistados,
    estadoLider,
    ultimos, // [{ numero, estado, created_at }]
  };

  cache = { data: resultado, ts: now };
  return NextResponse.json(resultado);
}
