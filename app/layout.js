export const metadata = {
  title: "LEGIONARIOS — Pasaporte Legionario",
  description: "La preparación derrota a la suerte.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
