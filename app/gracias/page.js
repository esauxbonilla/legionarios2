"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function GraciasContent() {
  const params = useSearchParams();
  const numero = params.get("n");

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
      <h1>Bienvenido a la Legión.</h1>
      <p style={{ fontSize: 22, margin: "24px 0" }}>
        Eres el Legionario <strong>#{numero}</strong>
      </p>
      <p style={{ opacity: 0.7 }}>
        Guarda este número. Pronto habrá una mecánica de referidos — te avisaremos por WhatsApp.
      </p>
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