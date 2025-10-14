# Sorteos Larnik v7.1 PRO (Next.js + Tailwind + Prisma/SQLite + Admin)

## Requisitos
- Node 18+
- PNPM (recomendado) o NPM

## Setup rápido
```bash
cp .env.example .env
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm db:seed
pnpm dev
# http://localhost:3000
# Admin: /(admin)/signin  (demo: admin@larnik.mx / 123456)
```
### Qué trae
- **UI completa**: Hero, Rifas activas, Cómo funciona, Ganadores, FAQ, Footer PRO.
- **Logo visible** (logo‑pill) y **watermark** tenue en el body.
- **Admin real** con CRUD de rifas y ganadores (Prisma/SQLite).

