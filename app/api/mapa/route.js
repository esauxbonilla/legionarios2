import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// Cache en memoria simple (vive mientras la función serverless esté "caliente").
// Evita pegarle a la base en cada carga de página si hay mucho tráfico.
let cache = { data: null, ts: 0 };
const CACHE_MS = 8000;

export async function GET() {
  const now = Date.now();
  if (cache.data && now - cache.ts < CACHE_MS) {
    return NextResponse.json(cache.data);
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase.from("legionarios").select("estado");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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

  const resultado = {
    conteoPorEstado: conteo, // { "CDMX": 214, "JAL": 172, ... }
    total,
    estadosConquistados,
    estadoLider,
  };

  cache = { data: resultado, ts: now };
  return NextResponse.json(resultado);
}
