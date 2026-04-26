
# Security- DataShare

## Objectif
Ce document décrit les mesures de sécurité mises en œuvre pour protéger les données et les accès à l’application DataShare.

## 1.Authentification

L’application utilise Spring Security avec JWT.

- L’utilisateur se connecte via `/api/login`
- Un token JWT est généré après authentification
- Ce token doit être envoyé dans chaque requête protégée :
Authorization: Bearer <token>

---

## 2. Authorization

- Chaque utilisateur a accès uniquement à ses propres ressources
- Les fichiers sont liés à un utilisateur
- Le backend vérifie systématiquement la propriété des fichiers avant :
  - suppression
  - consultation
  - récupération
---

## 3. Password Security

- Les mots de passe sont hachés avec BCrypt
- Les mots de passe ne sont pas stockés en clair
- Les mots de passe ne sont pas renvoyés via API

---

## 4. File Security

- Les fichiers sont stockés côté serveur
- Chaque fichier possède un "token unique de téléchargement"
- Les fichiers ne sont pas accessibles directement via URL
- Les fichiers peuvent expirer après une durée définie
---

## 5. API Security

- Les endpoints sensibles sont protégés par Spring Security
- Le JWT est vérifié à chaque requête
- Les endpoints publics sont limités :
  - `/api/login`
  - `/api/register`
  - `/api/files/download/{token}`

---

## 6. CORS Policy

- CORS est configuré pour autoriser uniquement les origines autorisées
- Empêche les appels non autorisés depuis des domaines externes

## 7. Frontend Security

- Le token JWT est stocké dans le localStorage du navigateur
- Les requêtes API incluent automatiquement le token via HttpHeaders
- Les routes sensibles sont protégées par un AuthGuard

### Risque de sécurité (XSS)

Le stockage du JWT dans le localStorage expose l'application à des attaques XSS (Cross-Site Scripting).  
Un script malveillant injecté dans la page pourrait accéder au token et compromettre la session utilisateur.

### Amélioration future

- Migration vers des cookies HttpOnly
- Activation des flags Secure et SameSite
- Mise en place d’une protection CSRF

---

## 8. Audit de dépendances frontend avec angular (npm audit)

### Résultat

- Vulnérabilités totales : 11
  - 5 modérées
  - 6 élevées
  - 0 critiques

### Dépendances concernées

- postcss (moderate)
- serialize-javascript (high)
- tar (high)
- uuid (moderate)
- copy-webpack-plugin (high)
- webpack-dev-server (moderate)
- @angular-devkit/build-angular (high)
- @angular/cli (high)

### Remarques

- Aucune vulnérabilité critique détectée
- La majorité des vulnérabilités proviennent des dépendances de build (Angular / Webpack)
- Certaines vulnérabilités n'ont pas de correction directe disponible

## 9. Audit des dépendances backend avec `mvn dependency-check`

### Résultat

- Vulnérabilités totales : **35**
  - 2 critiques
  - 2 élevées
  - plusieurs modérées

### Dépendances concernées

- `spring-security-core` (critique)
- `tomcat-embed-core` (critique)
- `spring-boot` (élevée)
- `spring-boot-devtools` (élevée)
- `spring-core` (modérée)
- `log4j-api` (modérée)
- `commons-lang3` (modérée)
- `postgresql` (modérée)
- `dompurify` / `swagger-ui` (modérée)

### Remarques
- Des vulnérabilités critiques ont été détectées dans certaines dépendances backend
- Ces composants étant essentiels, ils doivent être surveillés en priorité
- Certaines vulnérabilités peuvent être liées à des dépendances non utilisées en production
- Une mise à jour des dépendances est recommandée