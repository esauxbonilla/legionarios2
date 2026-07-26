"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ESTADOS } from "@/lib/estados";
import { ESTADOS_PATHS } from "@/lib/estadosPaths";

// ── Configuración de campaña ──────────────────────────────────────────────
const URL_WHATSAPP = "https://chat.whatsapp.com/EEMgGq44580E3KoOhMM3an?s=cl&p=i&mlu=4"; // ← pega tu invitación real
const DROP = "01";
const ACCESO = "Early Access";
const FECHA_DROP = "10 ago 2026";

// ── Paleta ────────────────────────────────────────────────────────────────
const ROJO = "#a01c26";
const ROJO_CLARO = "#b3222b";
const HUESO = "#f7f3ec";
const TENUE = "#7d6a58";
const HAIRLINE = "rgba(200,195,185,.13)";
const ORNAMENTO = "rgba(200,195,185,.5)";

const display = { fontFamily: "var(--font-display), serif" };

const microLinea = {
  ...display,
  fontWeight: 500,
  fontSize: "clamp(10px, 2.4vw, 12px)",
  letterSpacing: ".24em",
  textTransform: "uppercase",
  color: TENUE,
  textAlign: "center",
  width: "100%",
};

const etiquetaCampo = {
  ...display,
  fontWeight: 500,
  fontSize: "clamp(13px, 3vw, 16px)",
  letterSpacing: ".04em",
  color: ROJO,
};

const valorCampo = {
  ...display,
  fontWeight: 500,
  fontSize: "clamp(20px, 4.6vw, 28px)",
  letterSpacing: ".01em",
  color: HUESO,
  marginTop: 3,
  overflowWrap: "break-word",
};

// Esquinas ornamentadas de la carta
function Esquina({ v, h }) {
  const grosor = `2px solid ${ORNAMENTO}`;
  return (
    <div
      style={{
        position: "absolute",
        [v]: "clamp(20px, 4vw, 28px)",
        [h]: "clamp(20px, 4vw, 28px)",
        width: 42,
        height: 42,
        [v === "top" ? "borderTop" : "borderBottom"]: grosor,
        [h === "left" ? "borderLeft" : "borderRight"]: grosor,
        pointerEvents: "none",
      }}
    />
  );
}

function MapaPasaporte({ codigo }) {
  return (
    <svg
      viewBox="0 0 975.5368 654.81897"
      style={{ width: "clamp(140px, 34vw, 210px)", height: "auto", display: "block", opacity: 0.95 }}
      aria-hidden="true"
    >
      {ESTADOS_PATHS.map((e) => {
        const mio = e.code === codigo;
        return (
          <path
            key={e.code}
            d={e.d}
            fill={mio ? ROJO : "#221b1c"}
            stroke={mio ? "#d8434c" : "#3a2f30"}
            strokeWidth={mio ? 1.2 : 0.5}
            style={mio ? { filter: "drop-shadow(0 0 7px rgba(179,34,43,.9))" } : undefined}
          />
        );
      })}
    </svg>
  );
}

function GraciasContent() {
  const params = useSearchParams();
  const [copiado, setCopiado] = useState(false);

  const numero = params.get("n") || "0";
  const codigo = params.get("e") || "";
  const nombre = params.get("nom") || "Legionario";

  const estado = useMemo(() => ESTADOS.find((es) => es.code === codigo), [codigo]);
  const estadoNombre = estado ? estado.name : "México";
  const numeroFmt = String(numero).padStart(5, "0");

  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(false), 2400);
    return () => clearTimeout(t);
  }, [copiado]);

  async function compartir() {
    const texto = `Soy el legionario #${numeroFmt} — ${estadoNombre} ya está en el mapa.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Pasaporte Legionario", text: texto, url: location.href });
        return;
      }
      await navigator.clipboard.writeText(`${texto} ${location.href}`);
      setCopiado(true);
    } catch (err) {
      /* el usuario canceló */
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "clamp(28px, 6vw, 72px) clamp(14px, 4vw, 40px) 56px",
        background:
          "radial-gradient(120% 80% at 50% -10%, #17090b 0%, #0a0607 42%, #050303 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* brasas */}
      <div
        style={{
          position: "absolute",
          left: "14%",
          bottom: -10,
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: ROJO_CLARO,
          animation: "emberUp 9s ease-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "82%",
          bottom: -10,
          width: 2,
          height: 2,
          borderRadius: "50%",
          background: "#d8a24a",
          animation: "emberUp 11s ease-out 2.5s infinite",
        }}
      />

      <div
        style={{
          ...display,
          fontWeight: 600,
          fontSize: "clamp(15px, 3.4vw, 22px)",
          letterSpacing: ".34em",
          textTransform: "uppercase",
          color: "#a89e92",
          textAlign: "center",
          animation: "fadeUp .6s ease both",
        }}
      >
        Registro confirmado
      </div>

      {/* ── la carta ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          marginTop: "clamp(20px, 4vw, 34px)",
          animation: "cardIn .9s cubic-bezier(.2,.7,.2,1) both",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 22,
            padding: 3,
            background:
              "linear-gradient(155deg, #6f6f74 0%, #23232a 18%, #8e8e96 34%, #1a1a1f 52%, #767680 72%, #202026 88%, #5c5c64 100%)",
            boxShadow:
              "0 50px 90px -30px rgba(0,0,0,.95), 0 0 0 1px rgba(0,0,0,.6), 0 0 70px -20px rgba(179,34,43,.28)",
          }}
        >
          {/* brillo que barre */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: 0,
              width: "34%",
              height: "150%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,.13), transparent)",
              animation: "sheen 7s ease-in-out 1.2s infinite",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />

          <div
            style={{
              position: "relative",
              borderRadius: 19,
              background: "linear-gradient(168deg, #16100f 0%, #0b0708 45%, #100b0c 100%)",
              overflow: "hidden",
            }}
          >
            {/* grano + halo */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.5,
                backgroundImage: "radial-gradient(rgba(255,255,255,.05) .6px, transparent .7px)",
                backgroundSize: "3px 3px",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(75% 45% at 50% 0%, rgba(179,34,43,.16) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* doble marco */}
            <div
              style={{
                position: "absolute",
                inset: "clamp(10px, 2.4vw, 16px)",
                border: "1px solid rgba(179,34,43,.42)",
                borderRadius: 12,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "clamp(15px, 3.2vw, 22px)",
                border: "1px solid rgba(196,190,180,.16)",
                borderRadius: 8,
                pointerEvents: "none",
              }}
            />

            <Esquina v="top" h="left" />
            <Esquina v="top" h="right" />
            <Esquina v="bottom" h="left" />
            <Esquina v="bottom" h="right" />

            <div
              style={{
                position: "relative",
                padding:
                  "clamp(38px, 8vw, 56px) clamp(30px, 7vw, 52px) clamp(28px, 6vw, 40px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Image
                src="/casco.png"
                alt="Yelmo legionario"
                width={372}
                height={372}
                priority
                style={{
                  width: "clamp(120px, 30vw, 186px)",
                  height: "auto",
                  display: "block",
                  filter:
                    "drop-shadow(0 14px 26px rgba(0,0,0,.85)) drop-shadow(0 0 30px rgba(179,34,43,.35))",
                }}
              />

              <div
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontWeight: 900,
                  fontSize: "clamp(34px, 8.4vw, 58px)",
                  lineHeight: 1,
                  letterSpacing: ".04em",
                  marginTop: "clamp(18px, 4vw, 26px)",
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #d9d6d0 28%, #8e8b86 55%, #efece7 78%, #a19d97 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  textShadow: "0 2px 14px rgba(0,0,0,.7)",
                }}
              >
                LEGIONARIOS
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", marginTop: "clamp(16px, 3.5vw, 22px)" }}>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(179,34,43,.55))" }} />
                <div style={{ width: 7, height: 7, background: ROJO_CLARO, transform: "rotate(45deg)" }} />
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(179,34,43,.55), transparent)" }} />
              </div>

              <div
                style={{
                  ...display,
                  fontWeight: 700,
                  fontSize: "clamp(26px, 6.4vw, 44px)",
                  lineHeight: 1.06,
                  letterSpacing: ".05em",
                  textAlign: "center",
                  marginTop: "clamp(16px, 3.5vw, 22px)",
                  color: ROJO,
                  textShadow: "0 1px 0 rgba(0,0,0,.9), 0 0 26px rgba(160,28,38,.4)",
                }}
              >
                PASAPORTE
                <br />
                FUNDADOR
              </div>

              <div
                style={{
                  ...microLinea,
                  marginTop: "clamp(18px, 4vw, 26px)",
                  paddingTop: "clamp(18px, 4vw, 26px)",
                  borderTop: `1px solid ${HAIRLINE}`,
                }}
              >
                Ya eres parte de la Legión
              </div>
              <div style={{ ...microLinea, marginTop: 8 }}>Eres el legionario</div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", marginTop: 10 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(200,195,185,.12)" }} />
                <span style={{ color: ROJO_CLARO, fontSize: 13 }}>✦</span>
                <span
                  style={{
                    ...display,
                    fontWeight: 600,
                    fontSize: "clamp(28px, 7vw, 42px)",
                    letterSpacing: ".1em",
                    color: "#f2ece4",
                    textShadow: "0 0 22px rgba(242,236,228,.22)",
                  }}
                >
                  #{numeroFmt}
                </span>
                <span style={{ color: ROJO_CLARO, fontSize: 13 }}>✦</span>
                <div style={{ flex: 1, height: 1, background: "rgba(200,195,185,.12)" }} />
              </div>

              {/* Drop / Acceso */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1px 1fr",
                  alignItems: "center",
                  gap: "clamp(12px, 3vw, 22px)",
                  width: "100%",
                  marginTop: "clamp(20px, 4.5vw, 30px)",
                  padding: "clamp(16px, 3.5vw, 22px) clamp(14px, 3.5vw, 24px)",
                  border: "1px solid rgba(179,34,43,.35)",
                  borderRadius: 6,
                  background: "linear-gradient(180deg, rgba(179,34,43,.08), rgba(0,0,0,.25))",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...display, fontWeight: 500, fontSize: "clamp(11px, 2.6vw, 14px)", letterSpacing: ".18em", textTransform: "uppercase", color: ROJO }}>
                    Drop
                  </div>
                  <div style={{ ...display, fontWeight: 600, fontSize: "clamp(30px, 7.4vw, 46px)", lineHeight: 1.05, color: HUESO, marginTop: 2 }}>
                    {DROP}
                  </div>
                </div>
                <div style={{ height: "100%", minHeight: 54, background: "rgba(200,195,185,.14)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...display, fontWeight: 500, fontSize: "clamp(11px, 2.6vw, 14px)", letterSpacing: ".18em", textTransform: "uppercase", color: ROJO }}>
                    Acceso
                  </div>
                  <div style={{ ...display, fontWeight: 500, fontSize: "clamp(17px, 4vw, 26px)", lineHeight: 1.2, color: HUESO, marginTop: 6 }}>
                    {ACCESO}
                  </div>
                </div>
              </div>

              {/* Nombre / Estado + mapa */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "clamp(14px, 4vw, 26px)",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "clamp(20px, 4.5vw, 30px)",
                  paddingTop: "clamp(20px, 4.5vw, 30px)",
                  borderTop: `1px solid ${HAIRLINE}`,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px, 3vw, 20px)", minWidth: 0 }}>
                  <div>
                    <div style={etiquetaCampo}>Nombre:</div>
                    <div style={valorCampo}>{nombre}</div>
                  </div>
                  <div>
                    <div style={etiquetaCampo}>Estado:</div>
                    <div style={valorCampo}>{estadoNombre}</div>
                  </div>
                </div>
                <MapaPasaporte codigo={codigo} />
              </div>

              {/* QR WhatsApp */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "clamp(22px, 4.5vw, 30px)",
                  paddingTop: "clamp(22px, 4.5vw, 30px)",
                  borderTop: `1px solid ${HAIRLINE}`,
                }}
              >
                <div
                  style={{
                    ...display,
                    fontWeight: 700,
                    fontSize: "clamp(20px, 4.8vw, 30px)",
                    lineHeight: 1.15,
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    textAlign: "center",
                    color: HUESO,
                    marginBottom: "clamp(16px, 3.5vw, 22px)",
                  }}
                >
                  Únete al grupo
                  <br />
                  de lanzamiento
                </div>

                <a href={URL_WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                  <Image
                    src="/qr-whatsapp.png"
                    alt="Código QR para unirte al grupo de WhatsApp de Legionarios"
                    width={1000}
                    height={1000}
                    style={{ display: "block", width: "clamp(180px, 46vw, 260px)", height: "auto" }}
                  />
                </a>

                <p
                  style={{
                    maxWidth: 420,
                    margin: "clamp(16px, 3.5vw, 22px) 0 0",
                    textAlign: "center",
                    fontSize: 13,
                    lineHeight: 1.9,
                    color: TENUE,
                    textWrap: "pretty",
                  }}
                >
                  Únete a nuestro grupo de WhatsApp, donde enviaremos el acceso anticipado a nuestra
                  tienda, preventa, la invitación a la fiesta de lanzamiento y más eventos.
                </p>
              </div>

              <div
                style={{
                  width: "100%",
                  marginTop: "clamp(20px, 4.5vw, 30px)",
                  paddingTop: "clamp(16px, 3.5vw, 22px)",
                  borderTop: `1px solid ${HAIRLINE}`,
                  textAlign: "center",
                  ...display,
                  fontWeight: 500,
                  fontSize: "clamp(11px, 2.6vw, 14px)",
                  letterSpacing: ".26em",
                  textTransform: "uppercase",
                  color: "#c9c2b8",
                }}
              >
                Preparación derrota a la suerte
              </div>

              <div style={{ marginTop: 14, color: ROJO_CLARO, fontSize: 12 }}>✦</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── acciones ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
          marginTop: "clamp(28px, 6vw, 40px)",
          animation: "fadeUp .8s ease .5s both",
        }}
      >
        <button
          type="button"
          onClick={compartir}
          style={{
            ...display,
            background: ROJO,
            color: HUESO,
            border: `1px solid ${ROJO_CLARO}`,
            padding: "16px 28px",
            minHeight: 52,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {copiado ? "Enlace copiado" : "Compartir mi pasaporte"}
        </button>
        <Link
          href="/"
          style={{
            ...display,
            border: "1px solid rgba(200,195,185,.22)",
            color: "#a89e92",
            padding: "16px 26px",
            minHeight: 52,
            display: "inline-flex",
            alignItems: "center",
            fontSize: 12,
            letterSpacing: ".2em",
            textTransform: "uppercase",
          }}
        >
          Volver al mapa
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px 26px",
          marginTop: "clamp(26px, 5vw, 38px)",
          fontSize: 10,
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "#4a4038",
        }}
      >
        <span>Legionarios © 2026</span>
        <span>Drop · {FECHA_DROP}</span>
      </div>
    </main>
  );
}

export default function Gracias() {
  return (
    <Suspense fallback={null}>
      <GraciasContent />
    </Suspense>
  );
}
