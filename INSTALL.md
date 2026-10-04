# Instructions d'Installation

## Problème de Permissions npm

Votre système a des problèmes de permissions avec npm/yarn. Avant d'installer les dépendances, vous devez corriger ces permissions.

## Solution Rapide

Exécutez cette commande dans votre terminal :

```bash
sudo chown -R $(whoami) /Users/mac/.npm /Users/mac/.cache
```

Cette commande va :
- Corriger les permissions du cache npm
- Corriger les permissions du cache de Node.js
- Vous donner la propriété de ces dossiers

## Installation des Dépendances

Une fois les permissions corrigées, allez dans le dossier du projet et installez les dépendances :

```bash
cd /Users/mac/Documents/Projects/familyX/family-memory
npm install
```

Si npm ne fonctionne toujours pas, essayez avec yarn :

```bash
yarn install
```

## Dépendances Principales

Le projet nécessite les packages suivants (déjà listés dans package.json) :

- `next@16.3.8` - Framework React
- `react@19.2.8` - Bibliothèque UI
- `react-dom@19.2.8` - React pour le DOM
- `@xyflow/react@^12.3.5` - Composant d'arbre interactif
- `elkjs@^0.9.3` - Algorithme de disposition automatique
- `lucide-react@^0.462.0` - Icônes

## Démarrage du Serveur

Après l'installation des dépendances :

```bash
npm run dev
```

Le serveur démarrera sur http://localhost:3000

## Vérification

Pour vérifier que tout fonctionne :

1. Ouvrez http://localhost:3000
2. Vous devriez voir l'arbre familial de la famille Martin-Sarr
3. Vous pouvez cliquer sur les cartes pour voir les détails
4. Vous pouvez zoomer et déplacer l'arbre
5. Vous pouvez rechercher des membres

## En Cas de Problème

Si vous rencontrez toujours des problèmes :

1. **Nettoyez complètement npm** :
   ```bash
   sudo rm -rf /Users/mac/.npm
   sudo rm -rf /Users/mac/.cache
   npm cache clean --force
   ```

2. **Réinstallez les dépendances** :
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

3. **Utilisez yarn à la place de npm** :
   ```bash
   brew install yarn
   yarn install
   ```

## Commandes Utiles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run start` - Démarrer le serveur de production
- `npm run lint` - Vérifier le code avec ESLint

## Prochaines Étapes

Une fois l'application lancée avec succès, vous pourrez :
- Explorer l'interface
- Tester toutes les fonctionnalités
- Commencer à travailler sur la Phase 2 (formulaires, Supabase)
