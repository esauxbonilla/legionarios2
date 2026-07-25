"use client";

import { useState } from "react";
import { ESTADOS_PATHS } from "@/lib/estadosPaths";

// viewBox original del SVG fuente (Mexico_template.svg)
const VIEW_W = 975.5368;
const VIEW_H = 654.81897;

// Territorio sin conquistar: rojo muy apagado, pero visible. La silueta del
// país siempre se lee; lo que cambia con los registros es la intensidad.
const OPACIDAD_BASE = 0.16;

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
        const activo = hover === estado.code || estadoSeleccionado === estado.code;

        // Escala logarítmica en vez de lineal: si un estado se dispara a 500 y
        // el resto anda en 20, con escala lineal el mapa entero se apaga. Así
        // los primeros registros de cada estado sí se notan.
        const intensidad =
          count === 0 ? 0 : Math.log(count + 1) / Math.log(maxCount + 1);

        const opacidad = OPACIDAD_BASE + intensidad * (1 - OPACIDAD_BASE);
        const fill = `rgba(255, 26, 46, ${opacidad.toFixed(3)})`;

        // El glow solo aparece con registros y crece con ellos: el brillo es la
        // recompensa visual de conquistar, no decoración del mapa vacío.
        const glow =
          count === 0
            ? "none"
            : `drop-shadow(0 0 ${2 + intensidad * 9}px rgba(255,26,46,${(
                0.35 + intensidad * 0.5
              ).toFixed(2)}))`;

        return (
          <path
            key={estado.code}
            data-estado={estado.code}
            d={estado.d}
            fill={fill}
            stroke={activo ? "#ffffff" : "rgba(255, 90, 105, .35)"}
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
