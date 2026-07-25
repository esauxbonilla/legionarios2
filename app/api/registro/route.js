import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const body = await req.json();
  const { nombre, email, whatsapp, estado, talla, prenda, instagram, consentimiento } = body;

  // 1. Validaciones mínimas
  if (!consentimiento) {
    return NextResponse.json(
      { ok: false, error: "Debes aceptar el consentimiento para registrarte." },
      { status: 400 }
    );
  }
  if (!nombre || !email || !estado) {
    return NextResponse.json(
      { ok: false, error: "Faltan campos obligatorios." },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();

  // 2. Verificar que el email no exista ya
  const { data: existente } = await supabase
    .from("legionarios")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existente) {
    return NextResponse.json(
      { ok: false, error: "Ese email ya está registrado." },
      { status: 409 }
    );
  }

  // 3. Insertar
  const { data, error } = await supabase
    .from("legionarios")
    .insert([
      {
        nombre,
        email,
        whatsapp,
        estado,
        talla,
        prenda,
        instagram,
        consentimiento: true,
      },
    ])
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // 4. Devolver número de legionario
  return NextResponse.json({ ok: true, numero_legionario: data.id });
}
