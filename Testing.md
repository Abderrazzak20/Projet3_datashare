# Testing DataShare

## 1. Objectif

Ce document décrit la stratégie de test du prototype DataShare.

L’objectif est de garantir :
- le bon fonctionnement des API backend
- la sécurité des accès
- le bon fonctionnement de l’interface utilisateur 
- la gestion correcte des fichiers

---

## 2. Type de tests

### 2.1 Tests manuels 

Les tests sont réalisés via :
- Postman (API backend)
- Swagger UI
- Navigateur pour le front end 

---

## 3. Tests Backend (API)

### 3.1 Authentification

- [ ] Inscription utilisateur (/api/register)
- [ ] Connexion utilisateur (/api/login)
- [ ] Génération du token JWT
- [ ] Accès refusé sans token (401)
- [ ] Accès refusé avec token invalide

---

### 3.2 Gestion des fichiers

- [ ] Upload de fichier (/api/files/upload)
- [ ] Upload refusé sans authentification
- [ ] Récupération des fichiers utilisateur (/api/files/my-files)
- [ ] Suppression d’un fichier (/api/files/{id})
- [ ] Vérification que l’utilisateur ne peut supprimer que ses fichiers

---

### 3.3 Téléchargement

- [ ] Téléchargement via token (/api/files/download/{token})
- [ ] Refus si token invalide (404)
- [ ] Refus si fichier expiré

---

### 3.4 Validation des données

- [ ] Email invalide rejeté
- [ ] Mot de passe inférieur à 8 caractères rejeté
- [ ] Type d'extension incorrect
- [ ] Données invalides → réponse 400

---

### 3.5 Tests de sécurité

- [ ] Accès aux endpoints protégés sans JWT → refus
- [ ] Vérification des droits utilisateur
- [ ] Protection des routes sensibles

---

## 4. Tests Frontend (Angular)

### 4.1 Authentification

- [ ] Inscription via formulaire
- [ ] Connexion via formulaire
- [ ] Stockage du JWT dans le localStorage
- [ ] Redirection après login vers l’espace utilisateur

---

### 4.2 Navigation et accès

- [ ] Accès aux routes protégées avec AuthGuard
- [ ] Refus d’accès sans connexion
- [ ] Redirection vers login si non authentifié

---

### 4.3 Gestion des fichiers

- [ ] Upload de fichier via interface
- [ ] Affichage des fichiers utilisateur
- [ ] Suppression de fichier via bouton dans le dashboard
- [ ] Rafraîchissement de la liste après action

---

### 4.4 Téléchargement

- [ ] Téléchargement via lien public (/download/:token)
- [ ] Affichage des informations du fichier
- [ ] Gestion des erreurs (token invalide)

---

## 5. Tests d’intégration (Frontend + Backend)

- [ ] Login → récupération du JWT → appels API sécurisés
- [ ] Upload → fichier visible dans l’historique
- [ ] Suppression → fichier supprimé côté backend et frontend
- [ ] Téléchargement → fichier récupéré correctement

---

## 6. Cas d’erreurs testés

- utilisateur non authentifié
- token invalide
- fichier expiré
- données invalides

---

## 7. Limites des tests 

- Tests principalement manuels
- Pas de tests unitaires automatisés
- Pas de tests frontend automatisés

---

## 8. Améliorations futures
- Tests automatisés CI/CD