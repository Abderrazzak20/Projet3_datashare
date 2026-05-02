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

## 7. Gestion des données utilisateurs (RGPD)

### 🔐 Données traitées
L’application DataShare traite les données suivantes :
- Email utilisateur
- Mot de passe (hashé)
- Fichiers uploadés
- Métadonnées des fichiers (nom, taille, date d’expiration)

### ⏳ Conservation des données
- Les fichiers sont conservés entre 1 et 7 jours selon la configuration utilisateur
- Les données associées sont supprimées automatiquement à expiration
- Les fichiers supprimés manuellement sont immédiatement effacés

### 🧑 Droits des utilisateurs
Conformément au RGPD, l’utilisateur peut :
- Supprimer ses fichiers à tout moment
- Accéder à ses données via l’historique

### 🔒 Sécurité des données
- Mots de passe stockés sous forme hashée
- Accès aux fichiers protégé par token unique
- Suppression automatique des données expirées

### 🎯 Finalité des données
Les données sont utilisées uniquement pour :
- Fournir le service de transfert de fichiers
- Authentifier les utilisateurs
- Générer et sécuriser les liens de téléchargement

### 🗑️ Droit à l’oubli
Une amélioration prévue consiste à permettre à l’utilisateur de demander la suppression complète de son compte et de toutes ses données associées.