# Family Memory

Application d'arbre généalogique interactif et zoomable.

## Phase 1 - MVP avec données fictives ✅

Cette première version est **100% fonctionnelle** et contient :
- ✅ Interface complète avec header et navigation
- ✅ Arbre familial interactif avec React Flow
- ✅ **Lignes de relations visibles** entre les membres (parent-enfant, conjoints)
- ✅ Disposition automatique élégante avec elkjs
- ✅ Cartes de membres avec gestion des données manquantes
- ✅ Panneau latéral pour afficher les détails d'un membre
- ✅ Calcul automatique des rôles familiaux
- ✅ Zoom et déplacement de l'arbre
- ✅ Recherche de membres
- ✅ 14 personnes fictives sur 4 générations

## Installation

⚠️ **Important** : Il y a actuellement des problèmes de permissions npm sur votre système. Vous devez d'abord corriger les permissions :

```bash
sudo chown -R $(whoami) /Users/mac/.npm /Users/mac/.cache
```

Ensuite, installez les dépendances :

```bash
cd family-memory
npm install
# ou
yarn install
```

## Démarrage

Lancez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Stack Technique

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** pour le style
- **React Flow** (@xyflow/react) pour l'arbre interactif
- **elkjs** pour la disposition automatique
- **Lucide Icons** pour les icônes
- **Inter** (Google Fonts) pour la typographie

## Structure du Projet

```
family-memory/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil (arbre familial)
│   └── globals.css         # Styles globaux et variables CSS
├── components/
│   ├── Header.tsx          # En-tête avec navigation
│   ├── FamilyToolbar.tsx   # Barre d'outils (recherche, zoom, ajout)
│   ├── FamilyTree.tsx      # Composant principal de l'arbre
│   ├── PersonCard.tsx      # Carte d'un membre
│   └── PersonPanel.tsx     # Panneau latéral de détails
└── lib/
    ├── types.ts            # Types TypeScript
    ├── mock-data.ts        # Données fictives
    ├── family-relations.ts # Calcul des rôles familiaux
    └── layout.ts           # Disposition automatique avec elkjs
```

## Fonctionnalités Actuelles

### ✅ Implémenté
- Navigation et interface utilisateur complète
- Arbre familial zoomable et déplaçable
- Cartes de membres avec dégradation élégante :
  - Gestion des photos manquantes (initiales ou icône)
  - Gestion des noms manquants (affichage du libellé)
  - Gestion des dates incomplètes
  - Indicateur visuel pour les personnes décédées
- Calcul automatique des rôles (Père, Mère, Frère, Grand-père, Oncle, etc.)
- Couleurs pastels par génération
- Recherche de membres
- Panneau de détails avec informations complètes
- Disposition automatique de l'arbre

### 🚧 À Venir (Phase 2)
- Formulaire d'ajout/modification de membres
- Gestion des photos (upload)
- Authentification avec Supabase
- Base de données PostgreSQL
- Stockage des photos
- Invitations de famille
- Fonctionnalités avancées (Activity, Memories, Events, Files)

## Direction Visuelle

- **Fond** : Gris très clair (#F8F8FA)
- **Accent** : Violet (#7C5CFC)
- **Cartes** : Blanches, coins très arrondis (16-20px), ombres légères
- **Typographie** : Inter, moderne et lisible
- **Couleurs de génération** :
  - Rose pastel (#FFE5F0)
  - Jaune pastel (#FFF4D6)
  - Turquoise pastel (#D6F4F4)
  - Lavande (#E5DCFF)

## Données de Test

L'application utilise actuellement des données fictives (famille Martin-Sarr) avec :
- 14 personnes sur 4 générations
- Cas de données manquantes (photos, dates, noms)
- Exemple de remariage
- Exemple de frères/sœurs (Aminata et Marie)
- Personnes décédées avec et sans dates

La personne focale par défaut est **Malik Martin** (ID: "10").

## Prochaines Étapes

1. ✅ Tester l'interface avec les données fictives
2. Créer le formulaire d'ajout/modification de membres
3. Implémenter la suppression avec confirmation
4. Ajouter l'upload de photos
5. Intégrer Supabase (Auth + Database + Storage)

## License

MIT
