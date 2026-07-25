"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ESTADOS } from "@/lib/estados";

const ROJO = "#ff1a2e";
const display = { fontFamily: "var(--font-display), serif" };

function GraciasContent() {
  const params = useSearchParams();
  const numero = params.get("n");
  const codigo = params.get("e");
  const estado = ESTADOS.find((es) => es.code === codigo);

  return (
    <main
      style={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        borderLeft: "1px solid #141414",
        borderRight: "1px solid #141414",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 22px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px clamp(16px, 3vw, 24px)",
          borderBottom: "1px solid #1a1a1a",
          fontSize: 10,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "#6b6b6b",
        }}
      >
        <span style={{ ...display, fontWeight: 800, fontSize: 16, letterSpacing: ".22em", color: "#f2f2f2" }}>
          LEGIONARIOS
        </span>
        <span>Pasaporte emitido</span>
      </div>

      <div
        style={{
          flex: 1,
          padding: "clamp(56px, 12vw, 120px) clamp(20px, 5vw, 60px)",
          textAlign: "center",
          animation: "legRise .6s ease both",
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", color: ROJO }}>
          Registro confirmado
        </div>
        <h1
          style={{
            ...display,
            fontWeight: 800,
            fontSize: "clamp(34px, 7vw, 60px)",
            lineHeight: 1.05,
            textTransform: "uppercase",
            margin: "20px 0 0",
          }}
        >
          Bienvenido
          <br />
          a la legión
        </h1>

        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            margin: "34px 0 0",
            border: `1px solid ${ROJO}`,
            padding: "26px clamp(28px, 8vw, 64px)",
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: "#9a9a9a" }}>
            Eres el legionario
          </span>
          <span
            style={{
              ...display,
              fontWeight: 800,
              fontSize: "clamp(48px, 12vw, 84px)",
              lineHeight: 1,
              color: ROJO,
            }}
          >
            #{numero}
          </span>
          <span style={{ fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "#6b6b6b" }}>
            {estado ? estado.name : "México"}
          </span>
        </div>

        <p
          style={{
            maxWidth: 460,
            margin: "30px auto 0",
            fontSize: 14,
            lineHeight: 1.8,
            color: "#9a9a9a",
          }}
        >
          Guarda este número. Te escribimos por WhatsApp para el acceso anticipado — 24 horas antes de
          que el drop abra al público.
        </p>

        <div style={{ marginTop: 30 }}>
          <Link
            href="/"
            style={{
              ...display,
              border: "1px solid #262626",
              color: "#9a9a9a",
              padding: "14px 26px",
              fontSize: 12,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              display: "inline-block",
            }}
          >
            Volver al mapa
          </Link>
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
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <span>Legionarios © 2026</span>
        <span>La preparación derrota a la suerte</span>
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
