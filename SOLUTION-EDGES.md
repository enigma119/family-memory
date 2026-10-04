# Solution : Problème des Lignes Invisibles

## 🐛 Le Problème

Les lignes de relations entre les membres de la famille ne s'affichaient pas, même si React Flow créait bien 21 edges.

### Symptômes
- ✅ Les cartes des membres s'affichaient correctement
- ❌ Aucune ligne visible entre les cartes
- ❌ `document.querySelectorAll('.react-flow__edge').length` retournait **0**
- ⚠️ Erreur dans la console : `[React Flow]: Couldn't create edge for source handle id: "null"`

## 🔍 La Cause

Les nœuds personnalisés (composant `PersonNode`) n'avaient **pas de handles** (points de connexion).

Dans React Flow, quand on crée des nœuds personnalisés, on doit explicitement ajouter des **handles** pour que les edges puissent se connecter. Sans handles, React Flow ne peut pas savoir où dessiner les lignes.

## ✅ La Solution

Ajout de **handles** invisibles aux nœuds personnalisés :

```tsx
import { Handle, Position } from "@xyflow/react";

function PersonNode({ data, selected }: NodeProps) {
  return (
    <>
      {/* Handle en haut - pour recevoir des connexions */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#7C5CFC", opacity: 0 }}
      />

      <PersonCard person={data} isSelected={selected} />

      {/* Handle en bas - pour envoyer des connexions */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#7C5CFC", opacity: 0 }}
      />

      {/* Handles gauche/droite - pour les conjoints */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{ background: "#7C5CFC", opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{ background: "#7C5CFC", opacity: 0 }}
      />
    </>
  );
}
```

### Explication des Handles

1. **Handle Top (target)** : Point de connexion en haut
   - Type : `target` = peut recevoir des connexions
   - Pour : les parents qui pointent vers l'enfant

2. **Handle Bottom (source)** : Point de connexion en bas
   - Type : `source` = peut envoyer des connexions
   - Pour : pointer vers les enfants

3. **Handles Left/Right (source + target)** : Points de connexion latéraux
   - Pour : les connexions horizontales entre conjoints
   - Avec `id` pour les différencier

4. **Style `opacity: 0`** : Les handles sont invisibles
   - Ils fonctionnent mais ne s'affichent pas
   - Seules les lignes sont visibles

## 📝 Fichiers Modifiés

1. **components/FamilyTree.tsx** - Composant principal avec elkjs
2. **components/FamilyTreeSimple.tsx** - Version simple sans elkjs (pour debug)

## 🧪 Vérification

Après la correction :
```javascript
document.querySelectorAll('.react-flow__edge').length
// Résultat : 21 (au lieu de 0)
```

## 📚 Leçon Apprise

**Important** : Quand on utilise des nœuds personnalisés dans React Flow :
- ✅ Toujours ajouter des `<Handle>` composants
- ✅ Définir `type="source"` pour les sorties
- ✅ Définir `type="target"` pour les entrées
- ✅ Définir `position` (Top, Bottom, Left, Right)
- ✅ Utiliser `id` si plusieurs handles de même type

## 🎨 Résultat Final

Maintenant l'arbre affiche correctement :
- ✅ Lignes grises pleines : relations parent → enfant
- ✅ Lignes grises pointillées : relations de couple
- ✅ Disposition automatique élégante avec elkjs
- ✅ Zoom, déplacement, sélection

## 🔗 Ressources

- [React Flow - Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes)
- [React Flow - Handles](https://reactflow.dev/api-reference/components/handle)
- [React Flow Error #008](https://reactflow.dev/error#008) - L'erreur qu'on a rencontrée
