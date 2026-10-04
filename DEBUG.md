# Guide de Débogage

## Problème : Les lignes de relations ne s'affichent pas

Si vous ne voyez pas les lignes entre les membres de la famille, suivez ces étapes :

### 1. Vérifier la Console du Navigateur

Ouvrez la console de votre navigateur (F12 ou Cmd+Option+I sur Mac) et cherchez ces messages :

```
🔍 Debug - Nodes créés: 14
🔍 Debug - Edges créés: XX
🔍 Debug - Edges: [...]
```

**Nombre d'edges attendu** : Environ 20-25 edges

Si vous voyez `Edges créés: 0`, il y a un problème avec la création des relations.

### 2. Vérifier que les Dépendances sont Installées

Les lignes utilisent React Flow et elkjs. Assurez-vous que toutes les dépendances sont installées :

```bash
npm install
# ou
yarn install
```

Vérifiez que ces packages sont présents dans `node_modules` :
- `@xyflow/react`
- `elkjs`

### 3. Vérifier les Styles CSS

Les styles des edges se trouvent dans `app/globals.css`. Vérifiez que ces styles sont présents :

```css
.react-flow__edge-path {
  stroke-width: 2px !important;
}
```

### 4. Corrections Appliquées

Les corrections suivantes ont été appliquées pour améliorer la visibilité des lignes :

1. **Épaisseur des lignes** : Augmentée à 2px (au lieu de 1.5px)
2. **Couleur** : Changée à #9CA3AF (gris moyen) au lieu de #E5E7EB (trop clair)
3. **Flèches** : Ajoutées sur les relations parent-enfant
4. **Lignes pointillées** : Pour les conjoints (strokeDasharray: "5,5")

### 5. Structure des Relations

L'arbre devrait montrer :

**Génération 0** (arrière-grands-parents) :
- Ibrahim (1) ←→ Mère d'Aminata (2) [couple]

**Génération 1** (grands-parents) :
- Aminata (3) ←→ Moussa (4) [couple]
- Marie (14) [sœur d'Aminata]

**Génération 2** (parents) :
- Fatou (5) ←→ Jean (6) [couple]
- Ibrahima (7) ←→ Sophie (8) [couple]
- Ibrahima (7) ←→ Aïcha (9) [remariage]

**Génération 3** (enfants) :
- Malik (10) - personne focale
- Léa (11)
- Omar (12)
- Yasmine (13)

### 6. Types de Lignes

- **Lignes pleines avec flèches** : Relations parent → enfant
- **Lignes pointillées** : Relations de couple (conjoint)

### 7. Rechargement de la Page

Après avoir vérifié les étapes ci-dessus :

1. Arrêtez le serveur (Ctrl+C)
2. Relancez : `npm run dev`
3. Rechargez la page dans le navigateur (Cmd+R ou Ctrl+R)
4. Videz le cache si nécessaire (Cmd+Shift+R ou Ctrl+Shift+R)

### 8. Vérifier React Flow dans le DOM

Dans les DevTools du navigateur :
1. Ouvrez l'onglet "Elements" ou "Inspecteur"
2. Cherchez `<svg class="react-flow__edges">`
3. À l'intérieur, vous devriez voir plusieurs éléments `<g class="react-flow__edge">`

Si vous ne voyez pas ces éléments, React Flow n'est pas correctement initialisé.

### 9. Messages d'Erreur Courants

#### "Cannot find module '@xyflow/react'"
→ Exécutez `npm install @xyflow/react`

#### "Cannot find module 'elkjs'"
→ Exécutez `npm install elkjs`

#### Les cartes s'affichent mais pas les lignes
→ Vérifiez que les styles React Flow sont chargés :
- Ouvrez `components/FamilyTree.tsx`
- Vérifiez la ligne : `import "@xyflow/react/dist/style.css";`

### 10. Test Manuel

Si tout le reste échoue, testez avec ce code dans la console du navigateur :

```javascript
// Vérifier que React Flow est chargé
console.log(document.querySelector('.react-flow__edges'));

// Compter les edges
console.log('Nombre d\'edges:', document.querySelectorAll('.react-flow__edge').length);
```

Vous devriez voir un nombre > 0 pour les edges.

## Besoin d'Aide ?

Si le problème persiste après ces vérifications :
1. Notez le contenu exact de la console
2. Vérifiez s'il y a des erreurs (en rouge)
3. Prenez une capture d'écran de l'inspecteur React Flow
