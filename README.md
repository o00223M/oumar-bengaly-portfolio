# Portfolio d'Oumar Bengaly

Site portfolio en français pour Oumar Bengaly (ingénieur agronome, coordinateur
pays Impactus Afrika, facilitateur YOUNGO), avec un espace d'administration
protégé par mot de passe pour gérer le portfolio et les partenaires sans toucher
au code.

## Stack technique

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** — palette noir / violet / orange, police système Apple
- **Prisma + PostgreSQL (Supabase)** — base de données hébergée gratuitement
- **Supabase Storage** — hébergement des images/vidéos téléversées
- **Framer Motion** — animations et micro-interactions
- Authentification admin par mot de passe (cookie de session signé, JWT via `jose`)

Cette stack a été choisie pour permettre un hébergement **100 % gratuit et
permanent** sur Vercel + Supabase (voir plus bas), sans mise en veille et sans
perte de données au fil des mises à jour.

## Démarrage local

```bash
npm install
npx prisma migrate dev   # crée les tables dans la base Supabase
npx prisma db seed       # charge le contenu de démonstration (placeholders)
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour le site public et
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) pour
l'administration.

## Configuration (`.env`)

Copiez `.env.example` en `.env` et remplissez les valeurs (voir ce fichier
pour le détail de chaque variable — connexion Postgres, clés Supabase, mot de
passe admin, secret de session).

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

Les fichiers téléversés (images/vidéos, 50 Mo max) sont stockés dans un bucket
Supabase Storage public nommé `uploads`.

## Déploiement gratuit (Vercel + Supabase)

### 1. Supabase (base de données + stockage)

1. Créez un compte sur [supabase.com](https://supabase.com) (gratuit, sans
   carte bancaire) et un nouveau projet.
2. Dans **Storage**, créez un bucket nommé exactement `uploads`, avec
   l'option **Public bucket** activée.
3. Dans **Project Settings → Database**, récupérez les chaînes de connexion
   *Transaction pooler* (port 6543, pour `DATABASE_URL`) et *Direct connection*
   (port 5432, pour `DIRECT_URL`).
4. Dans **Project Settings → API**, récupérez le `Project URL`
   (`SUPABASE_URL`) et la clé secrète `service_role` (`SUPABASE_SERVICE_ROLE_KEY`).

### 2. Initialiser la base

Remplissez `.env` en local avec ces valeurs, puis :

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. Vercel (hébergement)

1. Créez un compte sur [vercel.com](https://vercel.com) (gratuit) et
   connectez-le à votre compte GitHub.
2. **Add New → Project**, sélectionnez le dépôt `oumar-bengaly-portfolio`.
3. Dans **Environment Variables**, ajoutez les mêmes variables que dans
   `.env` : `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `SESSION_SECRET`.
4. Cliquez sur **Deploy**.

Le site est alors accessible à l'URL fournie par Vercel (ex.
`oumar-bengaly-portfolio.vercel.app`), gratuitement et sans limite de temps.
Un domaine personnalisé peut être ajouté gratuitement ensuite dans les
réglages du projet Vercel.
