# Audit de sécurité & guide de déploiement Render

## 1. Audit de sécurité — ce qui a été trouvé et corrigé

| # | Problème trouvé | Gravité | Correction apportée |
|---|---|---|---|
| 1 | `403` renvoyé au lieu de `401` sur token invalide/expiré → le frontend ne nettoyait jamais le token périmé | Moyenne (bug fonctionnel + confusion sécurité) | `JwtAuthenticationFilter` ne plante plus sur un token invalide ; `SecurityConfig` renvoie un vrai `401` via un `AuthenticationEntryPoint` dédié |
| 2 | CORS ouvert à **toutes les origines** (`*`) avec `allowCredentials(true)` | **Haute** | Origines restreintes à une liste explicite, configurable via `CORS_ALLOWED_ORIGINS` |
| 3 | Secret JWT codé en dur dans `application.properties`, committé dans le dépôt | **Haute** | Externalisé via `JWT_SECRET` (variable d'environnement) ; Render génère automatiquement une valeur aléatoire forte via `generateValue: true` |
| 4 | Identifiants de base de données en clair dans `application.properties` | **Haute** | Externalisés via `SPRING_DATASOURCE_*` |
| 5 | Mot de passe admin par défaut (`admin123`) codé en dur et affiché en clair au démarrage | Moyenne | Externalisé via `ADMIN_EMAIL` / `ADMIN_PASSWORD` ; Render génère un mot de passe aléatoire fort à la place de la valeur par défaut |
| 6 | Logs Hibernate en `TRACE` (`BasicBinder`) : journalise les **valeurs** des paramètres de requêtes SQL (mots de passe hashés, emails...) en clair dans les logs serveur | Moyenne | Niveau ramené à `WARN` par défaut, configurable |
| 7 | Exceptions internes non prévues renvoyées telles quelles au client (fuite potentielle de détails techniques) | Moyenne | Un handler générique masque les erreurs inattendues côté client (message générique) et journalise le détail complet côté serveur uniquement |
| 8 | Aucun `.gitignore` dans tout le projet : `target/`, `node_modules/`, build, IDE files risquaient d'être committés | Faible/Hygiène | `.gitignore` ajoutés pour `backend/` et `frontend/` |
| 9 | `authApi.js` (frontend) pointait en dur vers `http://localhost:8080` — bloquant total pour un déploiement | **Bloquant en déploiement** | Utilise désormais la même variable `VITE_API_URL` que le reste de l'app |
| 10 | `/actuator/health` nécessitait une authentification, ce qui aurait fait échouer les *health checks* de Render | **Bloquant en déploiement** | Rendu public (`permitAll`), mais `show-details=when-authorized` pour ne jamais exposer de détails internes aux appels anonymes |

### Points déjà corrects (vérifiés, aucune action nécessaire)
- Mots de passe hashés en **BCrypt**, jamais stockés/renvoyés en clair (`EnseignantDTO`/`EtudiantDTO` ne renvoient jamais le hash).
- Pas d'injection SQL : toutes les requêtes passent par Spring Data JPA (repositories dérivés), aucune concaténation de chaîne SQL.
- Permissions par rôle (`@PreAuthorize`) correctement appliquées sur les routes sensibles (création/suppression de comptes réservée à l'Admin, programme complet réservé à Admin/Chef de projet).
- CSRF désactivé volontairement et sans risque, car l'API est *stateless* (JWT en en-tête `Authorization`, pas de cookies de session).

### Recommandations non implémentées (à considérer plus tard, hors urgence)
- **Rate limiting** sur `/api/auth/login` pour limiter le bruteforce (ex: Bucket4j, ou le faire au niveau du reverse proxy).
- **Rotation du JWT** : actuellement 24h de validité fixe, pas de refresh token — acceptable pour la taille du projet mais à revoir si l'usage grandit.
- Le token JWT est stocké dans `localStorage` côté frontend (vulnérable en cas de faille XSS). C'est un compromis courant en SPA ; une alternative plus robuste serait un cookie `HttpOnly` + `SameSite`, mais cela demande une refonte plus large de l'authentification.

---

## 2. Déploiement sur Render

### Option A — Déploiement automatique via `render.yaml` (recommandé)
Un fichier `render.yaml` a été ajouté à la racine du projet. Il décrit :
- une base **PostgreSQL** (`missionflow-db`)
- le **backend** Spring Boot (service web Java)
- le **frontend** React (site statique)

**Étapes :**
1. Pousser le projet sur GitHub/GitLab.
2. Sur [render.com](https://render.com) → **New +** → **Blueprint** → sélectionner le dépôt.
3. Render détecte `render.yaml` et propose de créer les 3 ressources automatiquement.
4. Après le premier déploiement, aller dans le service **missionflow-backend** → **Environment** → récupérer la valeur générée de `ADMIN_PASSWORD` (Render l'a générée aléatoirement) pour te connecter la première fois, puis **change immédiatement ce mot de passe** depuis l'application.
5. Si les noms `missionflow-backend` / `missionflow-frontend` sont déjà pris, Render leur donnera une URL différente : mets alors à jour `CORS_ALLOWED_ORIGINS` (backend) et `VITE_API_URL` (frontend) avec les vraies URL générées, dans l'onglet **Environment** de chaque service, puis redéploie.

### Option B — Configuration manuelle (si tu préfères ne pas utiliser le Blueprint)

**Base de données**
- New + → PostgreSQL → note l'*Internal Database URL*, l'utilisateur et le mot de passe.

**Backend (Web Service)**
- Root Directory : `backend`
- Build Command : `mvn clean package -DskipTests`
- Start Command : `java -jar target/*.jar`
- Health Check Path : `/actuator/health`
- Variables d'environnement à définir (voir `backend/.env.example`) :
  `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

**Frontend (Static Site)**
- Root Directory : `frontend`
- Build Command : `npm install && npm run build`
- Publish Directory : `dist`
- Variable d'environnement : `VITE_API_URL=https://<url-du-backend>.onrender.com/api/v1`
- Ajouter une règle de réécriture `/* → /index.html` (fichier `frontend/public/_redirects` déjà inclus, ou onglet **Redirects/Rewrites** de Render) — indispensable pour que les routes React Router fonctionnent après un rafraîchissement de page.

### ⚠️ Important — Base de données gratuite Render
Le plan **gratuit** PostgreSQL de Render est **supprimé automatiquement au bout de 30 jours**, sans possibilité de récupération après coup. Ce n'est adapté que pour une démo/un test. Pour un usage réel :
- passer sur un plan payant PostgreSQL **avant** l'expiration, ou
- faire un export régulier (`pg_dump`) pendant la période gratuite.

### Après le premier déploiement
- Charger les données de test si besoin : `psql "<Internal ou External Database URL fournie par Render>" -f backend/seed_test_data.sql`
- Une fois les tables stabilisées, envisager de passer `DDL_AUTO` de `update` à `validate` pour éviter toute modification automatique et non voulue du schéma en production.
