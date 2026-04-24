# 🧪 TESTING.md

## Objectif
Ce document décrit la stratégie de tests mise en place afin de garantir la qualité, la fiabilité et la conformité de l’application DataShare.

---

## 1. Types de tests implémentés

### Tests unitaires
Les tests unitaires vérifient le bon fonctionnement des composants critiques de l’application backend et frontend.

Backend :
- Génération de token JWT
- Validation du format du token
- Rejet des tokens expirés ou invalides

Frontend (Angular) :
- Affichage et filtrage des fichiers
- Upload de fichiers
- Téléchargement de fichiers
- Navigation entre les pages
- Gestion des erreurs utilisateur

Outils :
- JUnit 5 (backend)
- Jasmine / Karma (frontend Angular)

---

### Tests d’intégration
Les tests d’intégration valident le comportement des contrôleurs avec des services mockés.

- Test des endpoints REST (upload, download, login)
- Vérification des réponses HTTP (200, 400, 404)
- Validation des entrées utilisateur
- Simulation des services avec Mockito

Outils :
- @WebMvcTest
- MockMvc
- Mockito

---

### Tests fonctionnels
Les tests fonctionnels vérifient le respect des règles métier :

- Accès uniquement aux ressources appartenant à l’utilisateur
- Gestion correcte des fichiers expirés
- Validation des données utilisateur
- Comportement des endpoints sécurisés

---

### Tests end-to-end (E2E)

Les tests end-to-end simulent le comportement réel d’un utilisateur sur l’ensemble du système.

Scénarios testés :

- Inscription → connexion → récupération du JWT
- Upload de fichier avec authentification
- Génération d’un lien de téléchargement
- Téléchargement du fichier via token
- Vérification du contenu téléchargé
- Gestion des erreurs :
  - login invalide (401)
  - token de téléchargement invalide (404)

Ces tests utilisent MockMvc avec un contexte Spring Boot complet.

---

## 2. Objectif de couverture
L’objectif est d’atteindre une couverture minimale de **70 %**, conformément aux exigences du référentiel.

La priorité est donnée :
- à la sécurité
- aux règles métier
- aux endpoints exposés

---

## 3.1 Résultats de couverture (Frontend Angular)

Statements : 74.59% (185/248)  
Branches : 35.71% (15/42)  
Functions : 79.72% (59/74)  
Lines : 77.92% (173/222)  

## 3.2 Résultats de couverture (Backend)

backend global:    87,9 %  
src/main/java:     78,5 %  
src/test/java:     97,3 %  
