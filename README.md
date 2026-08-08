# Portfolio d'Oumar Bengaly

Site portfolio en français pour Oumar Bengaly (ingénieur agronome, coordinateur
pays Impactus Afrika, facilitateur YOUNGO), avec un espace d'administration
protégé par mot de passe pour gérer le portfolio et les partenaires sans toucher
au code.

## Stack technique

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** — palette terre cuite / vert profond / sable / blanc cassé
- **Prisma + SQLite** — base de données locale (`prisma/dev.db`)
- **Framer Motion** — animations et micro-interactions
- Authentification admin par mot de passe (cookie de session signé, JWT via `jose`)

## Démarrage

```bash
npm install
npx prisma migrate dev   # crée la base SQLite si besoin
npx prisma db seed       # charge le contenu de démonstration (placeholders)
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour le site public et
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) pour
l'administration.

## Configuration (`.env`)

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | chemin de la base SQLite (`file:./dev.db`) |
| `ADMIN_PASSWORD` | mot de passe de connexion à l'admin — **à changer avant mise en ligne** |
| `SESSION_SECRET` | secret de signature des sessions — **à régénérer avant mise en ligne** |

Le mot de passe par défaut en local est `ChangeMoi2026!`. Changez-le et
régénérez `SESSION_SECRET` (une chaîne aléatoire longue) avant tout déploiement
public.

## Contenu à remplacer

- `src/lib/constants.ts` — liens LinkedIn / Facebook réels d'Oumar.
- Tout le contenu du portfolio et les logos partenaires sont actuellement des
  **placeholders générés** (`public/placeholders/`, `prisma/seed.ts`). Une fois
  le site en ligne, remplacez-les depuis l'espace admin — les vrais éléments
  ajoutés via l'admin apparaissent immédiatement sur le site public, aucun
  redéploiement n'est nécessaire.

## Espace admin

Accessible via un lien discret en bas de page (footer) ou directement sur
`/admin/login`. Permet de :

- Ajouter / modifier / supprimer des éléments du portfolio, leur catégorie,
  leur ordre d'affichage et leur statut "mis en avant".
- Ajouter / modifier / supprimer des logos partenaires et leur ordre.

Les fichiers téléversés (images/vidéos, 50 Mo max) sont stockés dans
`public/uploads/`.

## ⚠️ À savoir avant un déploiement sur Vercel

Vercel utilise un système de fichiers **éphémère et en lecture seule** en
production : les fichiers écrits dans `public/uploads/` au runtime (et la base
SQLite elle-même) **ne persisteront pas** entre les déploiements ou les
redémarrages de fonction. Pour un déploiement en production sur Vercel, il
faudra migrer :

1. le stockage des médias vers un service comme **Vercel Blob** ou **Cloudinary** ;
2. la base de données vers un service hébergé comme **Vercel Postgres**,
   **Neon** ou **Supabase** (Prisma migre facilement de SQLite à Postgres).

En local, ou sur un hébergement avec disque persistant (VPS, Railway, etc.),
la configuration actuelle fonctionne telle quelle.
