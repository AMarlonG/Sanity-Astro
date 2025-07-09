# Frontend - Astro + HTMX

Dette er frontend-applikasjonen for Sanity-prosjektet, bygget med Astro og HTMX.

## Krav

- Node.js >= 18.20.8 (kreves for Astro 5.x)
- npm >= 9.6.5

## Installasjon

```bash
npm install
```

## Utvikling

```bash
npm run dev
```

Serveren starter på http://localhost:4321

## Bygging

```bash
npm run build
```

## Funksjoner

- ✅ Astro 5.x med TypeScript
- ✅ Basic CSS-styling (ingen Tailwind)
- ✅ Responsivt design
- ✅ HTMX klar for integrasjon
- ✅ Sanity CMS integrasjon

## Struktur

```
src/
├── components/     # Gjenbrukbare komponenter
├── layouts/        # Astro layouts
├── lib/           # Utility funksjoner
├── pages/         # Astro sider
└── styles/        # CSS filer
```

## Neste steg

1. Integrere HTMX
2. Koble til Sanity CMS
3. Opprette dynamiske sider
