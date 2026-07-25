"use client";

import { useState } from "react";
import { ESTADOS_PATHS } from "@/lib/estadosPaths";

// viewBox original del SVG fuente (Mexico_template.svg)
const VIEW_W = 975.5368;
const VIEW_H = 654.81897;

export default function MapaMexico({
  conteoPorEstado = {},
  estadoSeleccionado = "",
  onSelectEstado,
  onHoverEstado,
}) {
  const [hover, setHover] = useState(null);
  const maxCount = Math.max(1, ...Object.values(conteoPorEstado));

  function marcar(code) {
    setHover(code);
    if (onHoverEstado) onHoverEstado(code);
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width="100%"
      style={{ display: "block", position: "relative" }}
      role="img"
      aria-label="Mapa de México por estados con registros de legionarios"
    >
      {ESTADOS_PATHS.map((estado) => {
        const count = conteoPorEstado[estado.code] || 0;
        const intensidad = count / maxCount; // 0 a 1
        const activo = hover === estado.code || estadoSeleccionado === estado.code;

        const fill =
          count === 0 ? "#0d0d0d" : `rgba(255, 26, 46, ${0.18 + intensidad * 0.82})`;
        const glow =
          count === 0
            ? "none"
            : `drop-shadow(0 0 ${2 + intensidad * 9}px rgba(255,26,46,0.85))`;

        return (
          <path
            key={estado.code}
            data-estado={estado.code}
            d={estado.d}
            fill={fill}
            stroke={activo ? "#ffffff" : "#1f1f1f"}
            strokeWidth={activo ? 1.4 : 0.5}
            style={{
              cursor: onSelectEstado ? "pointer" : "default",
              filter: glow,
              transition: "fill .25s, filter .25s, stroke .15s",
            }}
            onMouseEnter={() => marcar(estado.code)}
            onMouseLeave={() => marcar(null)}
            onClick={() => onSelectEstado && onSelectEstado(estado.code)}
          >
            <title>{`${estado.name}: ${count} legionario${count === 1 ? "" : "s"}`}</title>
          </path>
        );
      })}
    </svg>
  );
}
