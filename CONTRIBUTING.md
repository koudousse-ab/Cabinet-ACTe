# Cabinet ACTe Frontend - Contributing Guide

## Code Style

### Vue Components
- Utiliser la composition API ou Options API (cohérent)
- Noms en PascalCase: `TaskList.vue`, `TaskDetail.vue`
- Templates avec 2 espaces d'indentation
- Props et data bien typés

### JavaScript
- Utiliser ES6+
- Const/let au lieu de var
- Noms de variables en camelCase
- Fonctions en camelCase
- Comments en français

### CSS
- BEM naming: `.task-list__item--active`
- Variables CSS pour les couleurs
- Mobile-first approach
- Scoped styles quand possible

## Commit Messages

```
type(scope): subject

body

footer
```

### Types
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `refactor`: Refactorisation
- `style`: Changements de style (CSS)
- `test`: Ajout de tests
- `docs`: Documentation

### Exemple
```
feat(tasks): add task filtering by priority

Implemented filtering functionality to allow users to filter tasks
by priority level (LOW, MEDIUM, HIGH, URGENT).

Closes #42
```

## Pull Requests

1. Créer une branche: `git checkout -b feature/amazing-feature`
2. Commit: `git commit -m 'feat: add amazing feature'`
3. Push: `git push origin feature/amazing-feature`
4. Ouvrir PR avec description détaillée
5. Attendre review
6. Merge après approbation

## Testing

- Écrire des tests pour les nouvelles fonctionnalités
- Tester manuellement dans le navigateur
- Vérifier la responsivité (mobile, tablet, desktop)

## Performance

- Lazy load les composants
- Optimiser les images
- Minimiser les requêtes API
- Utiliser v-show au lieu de v-if quand possible

## Accessibilité

- Utiliser des labels sur les inputs
- Ajouter aria-labels quand nécessaire
- Tester au clavier
- Respecter les contrastes de couleur

---

Questions? Ouvrir une issue ou contacter: koudousetchedre@gmail.com
