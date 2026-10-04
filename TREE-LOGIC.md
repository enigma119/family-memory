# Logique d'Arbre Généalogique

## 🌳 Principe

L'arbre familial utilise la logique classique des arbres généalogiques :

```
    Parent1 ←─────→ Parent2    (ligne horizontale entre conjoints)
            │
            │  (ligne verticale du couple)
            ●  (nœud de jonction invisible)
         ┌──┴──┐
         │     │
      Enfant1 Enfant2  (lignes en T vers les enfants)
```

## 📐 Architecture

### 1. Nœuds de Jonction Invisibles

Pour chaque couple qui a des enfants, on crée un **nœud de jonction invisible** :
- Taille : 1px × 1px
- Invisible à l'écran
- Sert de point de connexion entre le couple et leurs enfants

### 2. Types de Connexions

#### Relations de Couple (Horizontal)
```
Parent1 ←─ ─ ─ ─→ Parent2
```
- Ligne pointillée horizontale
- De `Parent1` (handle right) vers `Parent2` (handle left)

#### Couple → Nœud de Jonction (Vertical)
```
Parent1 ←─────→ Parent2
        │
        ●
```
- Ligne pleine verticale
- De `Parent1` (handle bottom) vers `Junction` (handle top)

#### Nœud de Jonction → Enfants (En T)
```
        ●
     ┌──┴──┐
     │     │
  Enfant1 Enfant2
```
- Lignes pleines verticales
- De `Junction` (handle bottom) vers chaque `Enfant` (handle top)

### 3. Cas Particuliers

#### Parents Solo
Si un parent n'a pas de conjoint (ou conjoint non documenté), une ligne directe est tracée :
```
Parent Solo
     │
     │
  Enfant
```

#### Plusieurs Mariages
Chaque couple crée son propre nœud de jonction pour ses enfants :
```
Parent1 ←─────→ Conjoint1        Parent1 ←─────→ Conjoint2
         │                               │
         ●                               ●
         │                               │
      Enfant1                         Enfant2
```

## 🔧 Implémentation

### Fichiers Principaux

**`lib/family-tree-layout.ts`** :
- `findCouples()` : Identifie les couples avec enfants
- `createNodesWithJunctions()` : Crée personnes + nœuds de jonction
- `createEdgesWithJunctions()` : Crée les connexions avec la logique d'arbre
- `createFamilyTreeLayout()` : Fonction principale

**`components/JunctionNode.tsx`** :
- Composant React pour le nœud de jonction invisible
- 2 handles : top (receive) et bottom (send)

**`components/FamilyTree.tsx`** :
- Utilise `createFamilyTreeLayout()` pour générer l'arbre
- Type de nœud "junction" pour les points de connexion
- Ignore les clics sur les junctions

### Algorithme

1. **Analyser les relations** :
   - Trouver tous les couples (relations de type "spouse")
   - Pour chaque couple, identifier leurs enfants communs

2. **Créer les nœuds** :
   - Ajouter tous les nœuds de personnes visibles
   - Pour chaque couple avec enfants, créer un nœud de jonction invisible

3. **Créer les edges** :
   - **Conjoints** : ligne horizontale (right → left)
   - **Couple → Junction** : ligne verticale (bottom → top)
   - **Junction → Enfants** : lignes verticales (bottom → top)
   - **Parent solo → Enfant** : ligne directe (bottom → top)

4. **Disposition automatique** :
   - elkjs positionne tous les nœuds (y compris les junctions)
   - Les junctions sont placées entre les couples et leurs enfants

## 🎨 Styles des Lignes

- **Conjoints** : Gris clair (#D1D5DB), pointillées
- **Parents → Enfants** : Gris moyen (#9CA3AF), pleines
- **Épaisseur** : 2px

## ✨ Avantages

✅ **Visuel propre** : Une seule ligne descend du couple, pas de lignes qui se croisent
✅ **Logique claire** : Correspond aux arbres généalogiques traditionnels
✅ **Flexible** : Gère les parents solos, remariages, etc.
✅ **Performant** : elkjs optimise la disposition automatiquement

## 🐛 Débug

Si les lignes ne s'affichent pas correctement :

1. **Vérifier dans la console** : Les junctions sont-ils créés ?
   ```javascript
   console.log(nodes.filter(n => n.type === 'junction'));
   ```

2. **Vérifier les edges** : Les edges utilisent-ils les junctions ?
   ```javascript
   console.log(edges.filter(e => e.source.includes('junction')));
   ```

3. **Vérifier les handles** : Les IDs correspondent-ils ?
   - sourceHandle: "bottom", targetHandle: "top"

## 📊 Exemple de Données

Pour un couple (Person1 + Person2) avec 2 enfants :

**Nœuds créés** :
- `person-1` (Person1)
- `person-2` (Person2)
- `junction-1-2` (nœud invisible)
- `person-3` (Enfant1)
- `person-4` (Enfant2)

**Edges créés** :
- `spouse-1-2` : Person1 ↔ Person2 (horizontal)
- `couple-to-junction-1-2` : Person1 → Junction (vertical)
- `junction-to-child-1-2-3` : Junction → Enfant1 (vertical)
- `junction-to-child-1-2-4` : Junction → Enfant2 (vertical)
