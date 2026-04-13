# 📊 Rapport de performance – DataShare 

## 1. Introduction

Ce document présente les résultats des tests de performance réalisés sur la plateforme de transfert de fichiers DataShare à l’aide de l’outil **k6**.

L’objectif est d’évaluer le comportement du système sous charge avec plusieurs utilisateurs simultanés sur les principales API :
- Authentification (connexion / inscription)
- Upload de fichiers
- Téléchargement de fichiers

Tous les tests ont été exécutés sur un backend local Spring Boot avec authentification JWT.

---

## 2. Environnement de test

- Backend : Spring Boot (Java)
- Sécurité : Spring Security + JWT
- Stockage : système de fichiers local
- Outil de test : k6
- Environnement : local
- Base de données : PstgraySQL

---

## 3. Scénarios de test

### 3.1 Authentification – Login

- Utilisateurs : 50 VUs
- Durée : 30s

**Résultats :**
- Taux de réussite : 100%
- Erreurs : 0%
- Temps de réponse moyen : ~4,8s
- P95 : ~7,1s
- Maximum : ~10,3s

**Analyse :**
L’authentification fonctionne correctement sous charge, mais présente une latence élevée liée au hachage des mots de passe et aux requêtes base de données.

---

### 3.2 Inscription utilisateur

- Utilisateurs : 50 VUs
- Durée : 30s

**Résultats :**
- Taux de réussite : 94,6%
- Erreurs : 5,4%
- Temps de réponse moyen : ~6,1s
- P95 : ~13,6s
- Maximum : ~14,9s

**Analyse :**
L’inscription fonctionne sous charge, mais subit une dégradation des performances due aux insertions concurrentes et au hachage des mots de passe. 

---

### 3.3 Upload de fichiers

- Utilisateurs : 50 VUs
- Durée : 30s

**Résultats :**
- Taux de réussite : 94,6%
- Erreurs : 5,4%
- Temps de réponse moyen : ~1,6s
- P95 : ~7,8s
- Maximum : ~31s
- Débit : ~29 requêtes/sec

**Analyse :**
L’upload fonctionne correctement mais montre une instabilité sous forte charge.

---

### 3.4 Téléchargement de fichiers

- Utilisateurs : 30 VUs
- Durée : 30s

**Résultats :**
- Taux de réussite : 100%
- Erreurs : 0%
- Temps de réponse moyen : ~300ms
- P95 : ~1,1s
- Maximum : ~5,0s
- Débit : ~87 requêtes/sec

**Analyse :**
Le téléchargement est la fonctionnalité la plus performante du système, avec des temps de réponse très faibles et une excellente stabilité, en tenant compte du fait que le fichier utilisé pour le test était léger.

---

## 4. Observations globales

- Le système est fonctionnel sous charge concurrente.
- L’authentification et la gestion des fichiers fonctionnent correctement avec JWT.
- Les principales limitations de performance concernent :
  - le hachage des mots de passe
  - les écritures concurrentes lors de l’upload

---

## 5. Pistes d’optimisation

- Optimiser les connexions base de données
- Ajouter des index sur les champs critiques (email)
- Améliorer la gestion du stockage des fichiers (cloud type S3)
- Mettre en place un cache pour certaines opérations d’authentification

---

## 6. Conclusion

DataShare est stable et fonctionnel sous charge.

Même si certaines dégradations de performance apparaissent sous forte concurrence, le système reste fiable.
