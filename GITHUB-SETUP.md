# Configuration GitHub

## ✅ Ce qui a été fait

- ✅ Git initialisé
- ✅ Premier commit créé avec tout le code de la Phase 1
- ✅ 36 fichiers versionnés

## 📝 Étapes pour Connecter à GitHub

### 1. Créer un Repository sur GitHub

Allez sur https://github.com/new et créez un nouveau repository :

**Paramètres recommandés** :
- **Repository name** : `family-memory`
- **Description** : `Application d'arbre généalogique interactif - Next.js + React Flow`
- **Visibility** :
  - ⚠️ **Private** (recommandé car données familiales sensibles)
  - Ou **Public** si vous voulez le partager
- **❌ NE PAS** initialiser avec README, .gitignore ou license (on les a déjà)

### 2. Connecter le Repository Local

Une fois le repo créé sur GitHub, GitHub vous donnera des instructions. Utilisez celles-ci :

```bash
# Ajouter l'origine GitHub (remplacez USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/USERNAME/family-memory.git

# Renommer la branche en 'main' (si nécessaire)
git branch -M main

# Pousser le code
git push -u origin main
```

**OU si vous utilisez SSH** :
```bash
git remote add origin git@github.com:USERNAME/family-memory.git
git branch -M main
git push -u origin main
```

### 3. Vérifier

Une fois poussé, allez sur votre repository GitHub et vous devriez voir :
- ✅ 36 fichiers
- ✅ Le commit "Phase 1 - MVP Complet"
- ✅ README.md affiché sur la page principale

## 🔐 Fichiers Sensibles (Déjà Protégés)

Le `.gitignore` est configuré pour **NE PAS** versionner :
- ✅ `node_modules/` - Dépendances (très lourd)
- ✅ `.env*` - Variables d'environnement (secrets Supabase)
- ✅ `.next/` - Fichiers de build
- ✅ `*.log` - Logs

**Important pour Phase 2** : Quand vous ajouterez Supabase, les clés API seront dans `.env.local` et **ne seront PAS** poussées sur GitHub.

## 📋 Workflow Git Recommandé

### Pour Chaque Nouvelle Fonctionnalité

```bash
# 1. Créer une branche
git checkout -b feature/nom-de-la-feature

# 2. Faire vos modifications
# ... coder ...

# 3. Vérifier les changements
git status
git diff

# 4. Ajouter et committer
git add .
git commit -m "Description de la feature"

# 5. Pousser la branche
git push -u origin feature/nom-de-la-feature

# 6. Créer une Pull Request sur GitHub
# ... puis merger sur main ...

# 7. Revenir sur main et mettre à jour
git checkout main
git pull
```

### Pour la Phase 2

Vous pourriez créer des branches comme :
- `feature/add-person-form`
- `feature/supabase-auth`
- `feature/database-integration`
- `feature/photo-upload`

## 🏷️ Tags (Versions)

Pour marquer la fin de la Phase 1 :

```bash
# Créer un tag
git tag -a v1.0-phase1 -m "Phase 1 Complete - MVP avec données fictives"

# Pousser le tag
git push origin v1.0-phase1
```

## 📊 Statistiques du Projet

```bash
# Voir le nombre de lignes de code
git ls-files | xargs wc -l

# Voir l'historique des commits
git log --oneline

# Voir les fichiers modifiés
git log --stat
```

## 🚀 Déploiement Vercel (Optionnel)

Une fois sur GitHub, vous pouvez déployer facilement sur Vercel :

1. Allez sur https://vercel.com
2. "Import Project"
3. Sélectionnez votre repo GitHub
4. Vercel détectera Next.js automatiquement
5. Deploy !

**Variables d'environnement** : Ajoutez-les dans Vercel Dashboard pour la Phase 2 (Supabase keys)

## 🔄 Commandes Utiles

```bash
# Voir l'état actuel
git status

# Voir les différences
git diff

# Voir l'historique
git log --oneline --graph

# Annuler des changements non commités
git checkout -- <file>

# Revenir au dernier commit
git reset --hard HEAD

# Voir les branches
git branch -a

# Changer de branche
git checkout <branch-name>
```

## ⚠️ Avant de Pousser

**Vérifiez toujours** que vous ne committez pas :
- ❌ Clés API ou secrets
- ❌ Mots de passe
- ❌ Tokens d'authentification
- ❌ Données personnelles réelles

**Utilisez** `.env.local` pour tous les secrets (déjà dans .gitignore).
