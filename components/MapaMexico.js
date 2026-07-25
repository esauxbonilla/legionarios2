"use client";

import { useState } from "react";
import { ESTADOS_PATHS } from "@/lib/estadosPaths";

// viewBox original del SVG fuente (Mexico_template.svg)
const VIEW_W = 975.5368;
const VIEW_H = 654.81897;

export default function MapaMexico({ conteoPorEstado = {}, onSelectEstado }) {
  const [hover, setHover] = useState(null);

  const maxCount = Math.max(1, ...Object.values(conteoPorEstado));

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width="100%"
      style={{ maxWidth: 720, display: "block", margin: "0 auto" }}
    >
      {ESTADOS_PATHS.map((estado) => {
        const count = conteoPorEstado[estado.code] || 0;
        const intensidad = count / maxCount; // 0 a 1

        const fill = count === 0
          ? "#2a1414"
          : `rgba(255, 20, 40, ${0.25 + intensidad * 0.75})`;
        const glow = count === 0
          ? "none"
          : `drop-shadow(0 0 ${2 + intensidad * 7}px rgba(255,20,40,0.9))`;
        const stroke = hover === estado.code ? "#fff" : "#000";

        return (
          <path
            key={estado.code}
            data-estado={estado.code}
            d={estado.d}
            fill={fill}
            stroke={stroke}
            strokeWidth={hover === estado.code ? 1.2 : 0.5}
            style={{
              cursor: onSelectEstado ? "pointer" : "default",
              filter: glow,
              transition: "fill 0.2s, filter 0.2s",
            }}
            onMouseEnter={() => setHover(estado.code)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelectEstado && onSelectEstado(estado.code)}
          >
            <title>{`${estado.name}: ${count} legionario${count === 1 ? "" : "s"}`}</title>
          </path>
        );
      })}
    </svg>
  );
}