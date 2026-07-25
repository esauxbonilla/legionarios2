create table legionarios (
  id bigint generated always as identity primary key,
  nombre text not null,
  email text not null unique,
  whatsapp text,
  estado text not null,
  talla text,
  prenda text,
  instagram text,
  consentimiento boolean not null default false,
  created_at timestamptz not null default now()
);

-- Índice para que la query del mapa (GROUP BY estado) sea rápida
create index idx_legionarios_estado on legionarios (estado);
