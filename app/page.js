"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ESTADOS } from "@/lib/estados";
import MapaMexico from "@/components/MapaMexico";

export default function Home() {
  const router = useRouter();
  const [mapa, setMapa] = useState({ conteoPorEstado: {}, total: 0, estadosConquistados: 0, estadoLider: null });
  const [form, setForm] = useState({
    nombre: "", email: "", whatsapp: "", estado: "", talla: "", prenda: "", instagram: "", consentimiento: false,
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function cargarMapa() {
    const res = await fetch("/api/mapa");
    const data = await res.json();
    setMapa(data);
  }

  useEffect(() => {
    cargarMapa();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.consentimiento) {
      setError("Debes aceptar el consentimiento para continuar.");
      return;
    }
    setEnviando(true);
    const res = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setEnviando(false);

    if (!data.ok) {
      setError(data.error || "Algo salió mal.");
      return;
    }

    await cargarMapa();
    router.push(`/gracias?n=${data.numero_legionario}`);
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ letterSpacing: 4 }}>LEGIONARIOS</h1>
      <h2>PASAPORTE LEGIONARIO</h2>

      <section style={{ margin: "24px 0", opacity: 0.85 }}>
        <p><strong>READ BEFORE YOU JOIN</strong></p>
        <ul>
          <li>Early Access</li>
          <li>Limited Stock</li>
          <li>Founder Passport</li>
        </ul>
      </section>

      <section style={{ margin: "24px 0" }}>
        <p>Legionarios registrados: <strong>{mapa.total}</strong></p>
        <p>Estados conquistados: <strong>{mapa.estadosConquistados}</strong> / 32</p>
        <p>Estado líder: <strong>{mapa.estadoLider || "—"}</strong></p>
      </section>

      <section style={{ margin: "24px 0" }}>
        <MapaMexico
          conteoPorEstado={mapa.conteoPorEstado}
          onSelectEstado={(codigo) => setForm({ ...form, estado: codigo })}
        />
        <p style={{ textAlign: "center", opacity: 0.5, fontSize: 13, marginTop: 8 }}>
          Toca tu estado en el mapa para preseleccionarlo en el formulario
        </p>
      </section>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input placeholder="Nombre" required
          value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
        <input placeholder="Email" type="email" required
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="WhatsApp" required
          value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
        <select required value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
          <option value="">Selecciona tu estado</option>
          {ESTADOS.map(es => (
            <option key={es.code} value={es.code}>{es.name}</option>
          ))}
        </select>
        <input placeholder="Talla" required
          value={form.talla} onChange={e => setForm({ ...form, talla: e.target.value })} />
        <input placeholder="Prenda que más te interesa" required
          value={form.prenda} onChange={e => setForm({ ...form, prenda: e.target.value })} />
        <input placeholder="Instagram" required
          value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
        <label style={{ fontSize: 14 }}>
          <input type="checkbox"
            checked={form.consentimiento}
            onChange={e => setForm({ ...form, consentimiento: e.target.checked })} />
          {" "}Acepto el <a href="/privacidad" style={{ color: "#f33" }}>aviso de privacidad</a> y quiero unirme a la lista.
        </label>

        {error && <p style={{ color: "#f55" }}>{error}</p>}

        <button type="submit" disabled={enviando} style={{
          background: "#c00", color: "#fff", padding: "12px 20px", border: "none", cursor: "pointer",
        }}>
          {enviando ? "Enviando..." : "UNIRME A LA LEGIÓN"}
        </button>
      </form>
    </main>
  );
}
