# 🔧 Documentation de maintenance – DataShare 

## 1. Objectif

Ce document décrit les procédures de maintenance de l’application DataShare, incluant :
- la mise à jour des dépendances
- la fréquence des maintenances
- les risques associés
- les bonnes pratiques pour garantir la stabilité du système

---

## 2. Mise à jour des dépendances

### Backend (Spring Boot)

Les dépendances Maven doivent être mises à jour régulièrement :

- Vérification mensuelle des nouvelles versions
- Mise à jour progressive (éviter les changements majeurs simultanés)

**Procédure :**
1. Vérifier les vulnérabilités connues
2. Tester les mises à jour en environnement local
3. Exécuter les tests unitaires et d’intégration
4. Déployer uniquement après validation complète

---

### Frontend (Angular)

- Mise à jour des packages npm tous les 3 mois
- Commandes recommandées :
  - `npm update`

**Procédure :**
1. Vérifier compatibilité Angular / Node.js
2. Tester build et application
3. Vérifier performance avec Lighthouse

---

## 3. Base de données

- Vérification des migrations à chaque release
- Sauvegarde automatique quotidienne

---


## 4. Risques identifiés

### 🔴 Risques techniques

- Incompatibilité entre versions de dépendances
- Régressions après mise à jour Spring Boot ou Angular
- Perte de données lors des migrations DB

---

### 🔴 Risques de sécurité

- Vulnérabilités dans les dépendances (npm / Maven)
- Mauvaise configuration JWT ou expiration des tokens
---

### 🔴 Risques de performance

- Dégradation des performances après mise à jour
- Augmentation du temps de réponse API
- Saturation lors des uploads simultanés

---

## 6. Bonnes pratiques

- Toujours utiliser un environnement de test avant production
- Maintenir une couverture de tests minimale de 70%
- Effectuer des sauvegardes régulières de la base de données
- Surveiller les logs applicatifs (Spring Boot / serveur)