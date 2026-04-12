# Security- DataShare

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

- Les mots de passe sont hachés avec "BCrypt"
- Les mots de passe ne sont jamais stockés en clair
- Les mots de passe ne sont jamais renvoyés via API

---

## 4. File Security

- Les fichiers sont stockés côté serveur
- Chaque fichier possède un "token unique de téléchargement"
- Les fichiers ne sont pas accessibles directement via URL
- Les fichiers peuvent expirer après une durée définie
- Les fichiers expirés sont automatiquement refusés

---

## 5. Input Validation

Toutes les entrées utilisateur sont validées avec `jakarta.validation` :

- email valide obligatoire
- mot de passe minimum 8 caractères
- contrôle sur les fichiers uploadés

---

## 6. API Security

- Les endpoints sensibles sont protégés par Spring Security
- Le JWT est vérifié à chaque requête
- Les endpoints publics sont limités :
  - `/api/login`
  - `/api/register`
  - `/api/files/download/{token}`

---

## 7. CORS Policy

- CORS est configuré pour autoriser uniquement les origines autorisées
- Empêche les appels non autorisés depuis des domaines externes
