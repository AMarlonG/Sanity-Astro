# Visual Editing Setup for Sanity + Astro

Dette dokumentet beskriver hvordan du setter opp Visual Editing mellom Sanity Studio og din Astro-frontend.

## 🚀 Hva er Visual Editing?

Visual Editing lar deg redigere innhold direkte fra frontend-siden din ved å klikke på en "Rediger i Studio"-knapp som åpner Sanity Studio med det riktige dokumentet.

## 📋 Forutsetninger

- Sanity Studio kjører på `http://localhost:3333`
- Astro frontend kjører på `http://localhost:4321`
- Vercel-applikasjonen er deployet på `https://sanity-frontend-1h3okqrfi-amarlongs-projects.vercel.app`

## ⚙️ Konfigurasjon

### 1. Sanity Studio-konfigurasjon

Studio-konfigurasjonen er allerede oppdatert med:

- CORS-innstillinger for både lokal utvikling og Vercel
- Visual Editing-aktivering
- API-innstillinger

### 2. Frontend-konfigurasjon

Frontend-konfigurasjonen inkluderer:

- Visual Editing-komponent
- Layout-oppdateringer
- TypeScript-støtte

## 🔧 Miljøvariabler

### For Sanity Studio (studio/.env.local)

```bash
SANITY_STUDIO_PROJECT_ID=i952bgb1
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_URL=http://localhost:3333
SANITY_STUDIO_FRONTEND_URL=https://sanity-frontend-1h3okqrfi-amarlongs-projects.vercel.app
SANITY_STUDIO_CORS_ORIGINS=http://localhost:4321,https://sanity-frontend-1h3okqrfi-amarlongs-projects.vercel.app
```

### For Frontend (frontend/.env.local)

```bash
PUBLIC_SANITY_PROJECT_ID=i952bgb1
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_STUDIO_URL=http://localhost:3333
PUBLIC_SANITY_FRONTEND_URL=https://sanity-frontend-1h3okqrfi-amarlongs-projects.vercel.app
VERCEL_URL=https://sanity-frontend-1h3okqrfi-amarlongs-projects.vercel.app
```

## 🧪 Testing Visual Editing

### Lokal Testing

1. **Start Sanity Studio:**

   ```bash
   cd studio
   npm run dev
   ```

2. **Start Frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Visual Editing:**
   - Gå til en artikkel-side (f.eks. `/artikler/[slug]`)
   - Du skal se en "Rediger i Studio"-knapp øverst til høyre
   - Klikk på knappen for å åpne Sanity Studio med det riktige dokumentet

### Vercel Testing

1. **Deploy til Vercel:**

   ```bash
   cd frontend
   vercel --prod
   ```

2. **Oppdater CORS i Sanity:**
   - Gå til [manage.sanity.io](https://manage.sanity.io)
   - Velg prosjektet ditt
   - Gå til API-innstillinger
   - Legg til Vercel-URL-en i CORS-origins

## 🔍 Troubleshooting

### Visual Editing-knappen vises ikke

- Sjekk at du er i utviklingsmodus (`import.meta.env.DEV`)
- Sjekk at `documentId` og `documentType` er satt
- Sjekk at Sanity Studio kjører på `http://localhost:3333`

### CORS-feil

- Sjekk at Vercel-URL-en er lagt til i CORS-innstillingene
- Sjekk at `credentials: 'include'` er satt
- Sjekk at origin-listen inkluderer både lokal og produksjons-URL-er

### Studio åpner ikke riktig dokument

- Sjekk at `documentId` og `documentType` er korrekte
- Sjekk at dokumentet eksisterer i Sanity Studio
- Sjekk at du har tilgang til dokumentet

## 📚 Ressurser

- [Sanity Visual Editing Documentation](https://www.sanity.io/docs/visual-editing)
- [Astro + Sanity Integration](https://www.sanity.io/docs/astro-integration)
- [CORS Configuration](https://www.sanity.io/docs/cors-configuration)

## 🎯 Neste Steg

1. **Test Visual Editing** med dine eksisterende sider
2. **Legg til Visual Editing** på flere sider (artister, arrangementer, etc.)
3. **Konfigurer preview-modus** for utkast vs. publiserte versjoner
4. **Optimaliser for produksjon** med riktige miljøvariabler

---

**Merk:** Visual Editing-komponenten vises kun i utviklingsmodus for å unngå forvirring for sluttbrukere.
