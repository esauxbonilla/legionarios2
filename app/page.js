"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ESTADOS } from "@/lib/estados";
import { haceCuanto } from "@/lib/tiempo";
import MapaMexico from "@/components/MapaMexico";

const CUPO_TOTAL = 2000;
const FECHA_DROP = "10 ago 2026";

const ROJO = "#ff1a2e";
const LINEA = "#1a1a1a";
const TENUE = "#6b6b6b";

const display = { fontFamily: "var(--font-display), serif" };

const inputBase = {
  background: "#0c0c0c",
  border: "1px solid #1f1f1f",
  color: "#f2f2f2",
  padding: "15px 14px",
  fontSize: 13,
  letterSpacing: ".08em",
  outline: "none",
  minHeight: 48,
  width: "100%",
};

const labelChip = {
  ...display,
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: ".22em",
  textTransform: "uppercase",
  color: ROJO,
};

const microLabel = {
  fontSize: 10,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: TENUE,
  marginTop: 6,
};

const VACIO = {
  nombre: "",
  email: "",
  whatsapp: "",
  estado: "",
  talla: "",
  prenda: "",
  instagram: "",
  consentimiento: false,
};

export default function Home() {
  const router = useRouter();
  const [mapa, setMapa] = useState({
    conteoPorEstado: {},
    total: 0,
    estadosConquistados: 0,
    estadoLider: null,
    ultimos: [],
  });
  const [form, setForm] = useState(VACIO);
  const [hover, setHover] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function cargarMapa() {
    try {
      const res = await fetch("/api/mapa");
      const data = await res.json();
      if (data && data.conteoPorEstado) setMapa(data);
    } catch (e) {
      // sin conexión: dejamos el estado anterior
    }
  }

  useEffect(() => {
    cargarMapa();
    const t = setInterval(cargarMapa, 30000); // el mapa se siente vivo
    return () => clearInterval(t);
  }, []);

  const nombrePorCodigo = useMemo(() => {
    const m = {};
    ESTADOS.forEach((e) => {
      m[e.code] = e.name;
    });
    return m;
  }, []);

  const conteo = mapa.conteoPorEstado || {};
  const valores = Object.values(conteo);
  const max = Math.max(1, ...valores);
  const restantes = Math.max(0, CUPO_TOTAL - (mapa.total || 0));

  const ranking = useMemo(
    () =>
      Object.entries(conteo)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([code, count], i) => ({
          pos: String(i + 1).padStart(2, "0"),
          name: nombrePorCodigo[code] || code,
          count,
          pct: Math.round((count / max) * 100),
        })),
    [conteo, max, nombrePorCodigo]
  );

  const marcado = hover || form.estado;
  const etiquetaMapa = marcado
    ? `${nombrePorCodigo[marcado] || marcado} · ${conteo[marcado] || 0}`
    : "Escaneando territorio";

  function campo(key) {
    return (e) =>
      setForm((f) => ({
        ...f,
        [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.consentimiento) {
      setError("Debes aceptar el consentimiento para continuar.");
      return;
    }
    if (!form.estado) {
      setError("Selecciona tu estado en el mapa o en la lista.");
      return;
    }
    setEnviando(true);
    try {
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
      router.push(`/gracias?n=${data.numero_legionario}&e=${form.estado}`);
    } catch (err) {
      setEnviando(false);
      setError("No pudimos conectar. Revisa tu internet e inténtalo otra vez.");
    }
  }

  return (
    <main
      style={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        borderLeft: "1px solid #141414",
        borderRight: "1px solid #141414",
        minHeight: "100vh",
      }}
    >
      {/* ── barra superior ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 22px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px clamp(16px, 3vw, 24px)",
          borderBottom: `1px solid ${LINEA}`,
          fontSize: 10,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: TENUE,
          position: "sticky",
          top: 0,
          background: "rgba(5,5,5,.92)",
          backdropFilter: "blur(8px)",
          zIndex: 5,
        }}
      >
        <span style={{ ...display, fontWeight: 800, fontSize: 16, letterSpacing: ".22em", color: "#f2f2f2" }}>
          LEGIONARIOS
        </span>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              width: 7,
              height: 7,
              background: ROJO,
              borderRadius: "50%",
              animation: "legPulse 1.6s ease-in-out infinite",
            }}
          />
          Registro abierto · Drop {FECHA_DROP}
        </span>
      </div>

      {/* ── hero + mapa ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <div
          style={{
            padding: "clamp(40px, 7vw, 62px) clamp(20px, 3vw, 34px)",
            borderBottom: `1px solid ${LINEA}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: ".26em",
              textTransform: "uppercase",
              color: ROJO,
              animation: "legRise .7s ease both",
            }}
          >
            // Operación: conquista nacional
          </div>
          <h1
            style={{
              ...display,
              fontWeight: 800,
              fontSize: "clamp(38px, 6.2vw, 66px)",
              lineHeight: 1.02,
              letterSpacing: ".01em",
              textTransform: "uppercase",
              margin: "22px 0 0",
              animation: "legRise .9s ease .08s both",
            }}
          >
            Toma tu
            <br />
            estado
            <br />
            <span style={{ color: ROJO }}>
              antes que
              <br />
              nadie
            </span>
          </h1>
          <p
            style={{
              maxWidth: 460,
              fontSize: 14,
              lineHeight: 1.8,
              color: "#9a9a9a",
              margin: "24px 0 0",
              textWrap: "pretty",
              animation: "legRise .9s ease .16s both",
            }}
          >
            {CUPO_TOTAL.toLocaleString("es-MX")} pasaportes numerados. Acceso 24 h antes del drop.
            Cada registro pinta tu estado en el mapa nacional.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 30,
              animation: "legRise .9s ease .24s both",
            }}
          >
            <a
              href="#registro"
              style={{
                ...display,
                background: ROJO,
                color: "#050505",
                padding: "16px 28px",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: ".18em",
                textTransform: "uppercase",
              }}
            >
              Registrarme
            </a>
            <a
              href="#mapa"
              style={{
                ...display,
                border: "1px solid #262626",
                color: "#9a9a9a",
                padding: "16px 24px",
                fontSize: 12,
                letterSpacing: ".18em",
                textTransform: "uppercase",
              }}
            >
              Ver mapa en vivo
            </a>
          </div>

          <div
            style={{
              marginTop: 38,
              paddingTop: 22,
              borderTop: `1px solid ${LINEA}`,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))",
              gap: 20,
            }}
          >
            <div>
              <div style={{ ...display, fontWeight: 800, fontSize: 30 }}>
                {(mapa.total || 0).toLocaleString("es-MX")}
              </div>
              <div style={microLabel}>Registrados</div>
            </div>
            <div>
              <div style={{ ...display, fontWeight: 800, fontSize: 30 }}>
                {mapa.estadosConquistados || 0}/32
              </div>
              <div style={microLabel}>Estados</div>
            </div>
            <div>
              <div style={{ ...display, fontWeight: 800, fontSize: 30, color: ROJO }}>
                {restantes.toLocaleString("es-MX")}
              </div>
              <div style={microLabel}>Cupos libres</div>
            </div>
          </div>
        </div>

        <div
          id="mapa"
          style={{
            position: "relative",
            padding: "clamp(20px, 4vw, 30px) clamp(14px, 3vw, 26px)",
            borderBottom: `1px solid ${LINEA}`,
            borderLeft: `1px solid ${LINEA}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent, rgba(255,26,46,.5), transparent)",
              animation: "legScan 6s linear infinite",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "space-between",
              fontSize: 10,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: TENUE,
            }}
          >
            <span>MAPA_NACIONAL.LIVE</span>
            <span style={{ color: ROJO }}>● {etiquetaMapa}</span>
          </div>

          <div style={{ position: "relative", marginTop: 14 }}>
            <MapaMexico
              conteoPorEstado={conteo}
              estadoSeleccionado={form.estado}
              onHoverEstado={setHover}
              onSelectEstado={(codigo) => setForm((f) => ({ ...f, estado: codigo }))}
            />
          </div>

          <div
            style={{
              position: "relative",
              marginTop: 10,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "space-between",
              fontSize: 10,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: TENUE,
            }}
          >
            <span>Toca tu estado → se carga en el formulario</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              0
              <span
                style={{ width: 40, height: 6, background: `linear-gradient(90deg, #0d0d0d, ${ROJO})` }}
              />
              máx
            </span>
          </div>
        </div>
      </div>

      {/* ── ranking / feed / calendario ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 1,
          background: LINEA,
          borderBottom: `1px solid ${LINEA}`,
        }}
      >
        <div style={{ background: "#050505", padding: "28px clamp(18px, 3vw, 26px)" }}>
          <div style={labelChip}>Ranking en vivo</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
            {ranking.length === 0 && (
              <div style={{ fontSize: 12, color: TENUE }}>Todavía nadie. Sé el primero.</div>
            )}
            {ranking.map((r) => (
              <div key={r.name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    fontSize: 12,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                  }}
                >
                  <span style={{ color: "#d6d6d6" }}>
                    <span style={{ ...display, fontWeight: 600, color: TENUE }}>{r.pos}</span> · {r.name}
                  </span>
                  <span style={{ color: ROJO }}>{r.count}</span>
                </div>
                <div style={{ height: 2, background: "#161616" }}>
                  <div
                    style={{
                      height: 2,
                      width: `${r.pct}%`,
                      background: ROJO,
                      transition: "width .4s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#050505", padding: "28px clamp(18px, 3vw, 26px)" }}>
          <div style={labelChip}>Últimos registros</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            {(mapa.ultimos || []).length === 0 && (
              <div style={{ fontSize: 12, color: TENUE }}>Sin movimiento todavía.</div>
            )}
            {(mapa.ultimos || []).map((ev) => (
              <div
                key={ev.numero}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  fontSize: 12,
                  color: "#9a9a9a",
                  borderBottom: "1px dashed #161616",
                  paddingBottom: 8,
                }}
              >
                <span style={{ color: "#d6d6d6" }}>
                  #{ev.numero} · {ev.estado}
                </span>
                <span>{haceCuanto(ev.created_at)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#050505", padding: "28px clamp(18px, 3vw, 26px)" }}>
          <div style={labelChip}>Calendario</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 18 }}>
            {[
              ["EXP", "EXPECTATIVA", "finales de julio · registro abierto", true],
              ["REV", "REVELACIÓN", "semana del 3 de agosto", false],
              ["DRP", "LANZAMIENTO", "semana del 10 · la lista entra 24 h antes", false],
            ].map(([sigla, titulo, nota, activo]) => (
              <div key={sigla} style={{ display: "flex", gap: 14 }}>
                <span style={{ color: activo ? ROJO : TENUE, fontSize: 12 }}>{sigla}</span>
                <div>
                  <div style={{ ...display, fontWeight: 600, fontSize: 14, color: "#d6d6d6", letterSpacing: ".1em" }}>
                    {titulo}
                  </div>
                  <div style={{ fontSize: 11, color: TENUE, marginTop: 4 }}>{nota}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── formulario ── */}
      <div
        id="registro"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          borderBottom: `1px solid ${LINEA}`,
        }}
      >
        {/* Reemplaza este bloque por la foto de campaña (next/image, horizontal 3:2) */}
        <div
          style={{
            minHeight: 320,
            background: "repeating-linear-gradient(135deg, #0b0b0b 0 12px, #070707 12px 24px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <span
            style={{
              fontSize: 11,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "#3d3d3d",
              textAlign: "center",
              lineHeight: 1.9,
            }}
          >
            Foto de campaña
            <br />
            grupo · calle noche
            <br />
            horizontal 3:2
          </span>
        </div>

        <div
          style={{
            padding: "clamp(32px, 5vw, 44px) clamp(20px, 3vw, 34px)",
            borderLeft: `1px solid ${LINEA}`,
          }}
        >
          <h2
            style={{
              ...display,
              fontWeight: 800,
              fontSize: "clamp(28px, 4.4vw, 36px)",
              lineHeight: 1.08,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Solicitar
            <br />
            <span style={{ color: ROJO }}>pasaporte</span>
          </h2>
          <div style={{ fontSize: 12, color: TENUE, letterSpacing: ".08em", margin: "14px 0 26px" }}>
            7 campos obligatorios · tarda 40 segundos
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            <input
              placeholder="NOMBRE"
              required
              value={form.nombre}
              onChange={campo("nombre")}
              style={{ ...inputBase, gridColumn: "1 / -1" }}
            />
            <input
              placeholder="EMAIL"
              type="email"
              required
              value={form.email}
              onChange={campo("email")}
              style={inputBase}
            />
            <input
              placeholder="WHATSAPP"
              required
              value={form.whatsapp}
              onChange={campo("whatsapp")}
              style={inputBase}
            />
            <select
              required
              value={form.estado}
              onChange={campo("estado")}
              style={{ ...inputBase, gridColumn: "1 / -1" }}
            >
              <option value="">ESTADO</option>
              {ESTADOS.map((es) => (
                <option key={es.code} value={es.code}>
                  {es.name}
                </option>
              ))}
            </select>
            <input
              placeholder="TALLA"
              required
              value={form.talla}
              onChange={campo("talla")}
              style={inputBase}
            />
            <input
              placeholder="PRENDA"
              required
              value={form.prenda}
              onChange={campo("prenda")}
              style={inputBase}
            />
            <input
              placeholder="INSTAGRAM"
              required
              value={form.instagram}
              onChange={campo("instagram")}
              style={{ ...inputBase, gridColumn: "1 / -1" }}
            />

            <label
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                fontSize: 11,
                lineHeight: 1.8,
                color: "#9a9a9a",
                marginTop: 6,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              <input
                type="checkbox"
                checked={form.consentimiento}
                onChange={campo("consentimiento")}
                style={{ marginTop: 4, width: 18, height: 18, accentColor: ROJO, flex: "none" }}
              />
              <span>
                Acepto el <a href="/privacidad">aviso de privacidad</a> y quiero recibir avisos del
                drop por WhatsApp y correo.
              </span>
            </label>

            {error && (
              <p
                style={{
                  gridColumn: "1 / -1",
                  margin: "4px 0 0",
                  fontSize: 12,
                  letterSpacing: ".08em",
                  color: ROJO,
                  borderLeft: `2px solid ${ROJO}`,
                  paddingLeft: 10,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              style={{
                ...display,
                gridColumn: "1 / -1",
                background: enviando ? "#3d3d3d" : ROJO,
                color: "#050505",
                border: 0,
                padding: 18,
                minHeight: 52,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                cursor: enviando ? "wait" : "pointer",
                marginTop: 8,
              }}
            >
              {enviando ? "Enviando..." : "Unirme a la legión"}
            </button>
          </form>
        </div>
      </div>

      <div
        style={{
          padding: "18px clamp(16px, 3vw, 24px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 20px",
          justifyContent: "space-between",
          fontSize: 10,
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "#3d3d3d",
        }}
      >
        <span>Legionarios © 2026</span>
        <span>La preparación derrota a la suerte</span>
      </div>
    </main>
  );
}
