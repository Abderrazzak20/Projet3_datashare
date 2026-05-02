# 📊 Rapport de performance – DataShare

## 1. Introduction

Ce document présente les résultats des tests de performance réalisés sur la plateforme DataShare.

Deux types de tests ont été effectués :
- Tests de charge backend avec k6
- Performance frontend avec Lighthouse

L’objectif est d’évaluer la stabilité, la rapidité et la robustesse du système sous charge.

---

## 2. Environnement de test

- Backend : Spring Boot (Java)
- Sécurité : Spring Security + JWT
- Stockage : système de fichiers local
- Base de données : PostgreSQL
- Outil de test backend : k6
- Outil de test frontend : Lighthouse
- Environnement : local

---

## 3. Tests de performance backend (k6)

---

### 3.1 Authentification (Login)

- Utilisateurs : 50 VUs
- Durée : 30s

**Résultats :**
- Taux de réussite : 100%
- Temps de réponse moyen : ~4,23s
- P95 : ~6,93s
- Maximum : ~8,2s

**Analyse :**
Le système d’authentification fonctionne correctement sous charge.  
Les performances sont cohérentes avec un traitement incluant JWT + accès base de données.
---

### 3.2 Inscription utilisateur

- Utilisateurs : 50 VUs
- Durée : 30s

**Résultats :**
- Taux de réussite : 100%
- Temps de réponse moyen : ~2,52s
- P95 : ~4,5s
- Maximum : ~5,07s

**Analyse :**
Le système d'inscription fonctionne correctement sous charge.

---

### 3.3 Upload de fichiers

- Utilisateurs : 50 VUs
- Durée : 30s

**Résultats :**
- Taux de réussite : 94,6%
- Temps de réponse moyen : ~1,6s
- P95 : ~5,07s
- Maximum : ~7,4s
- Débit : ~16 requêtes/sec

**Analyse :**
L’upload fonctionne correctement mais montre une instabilité sous forte charge.

---

### 3.4 Téléchargement de fichiers

- Utilisateurs : 30 VUs
- Durée : 30s

**Résultats :**
- Taux de réussite : 100%
- Temps de réponse moyen : ~221ms
- P95 : ~590ms
- Maximum : ~1,79s
- Débit : ~44 requêtes/sec

**Analyse :**
Le téléchargement est l’endpoint le plus performant du système.

---

## 4. Tests frontend (Lighthouse)

Un audit Lighthouse a été réalisé sur l’application Angular en environnement de production.

### Résultats
- Performance : 76
- Best Practices : 96

### Analyse
Les performances sont satisfaisantes pour un prototype.
Les résultats depend aussi de l’environnement utilisé extensions Chrome.

### Améliorations possibles
- Lazy loading des modules Angular
- Optimisation des images et assets
- Mise en cache HTTP côté serveur