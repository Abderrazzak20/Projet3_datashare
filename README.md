# 📦 DataShare

## 📖 Description

DataShare est une application web permettant aux utilisateurs de téléverser des fichiers et de les partager via des liens de téléchargement temporaires.

La plateforme propose :

* Une authentification sécurisée (JWT)
* Le téléversement et téléchargement de fichiers via des tokens uniques
* La gestion de l’expiration des fichiers
* Un historique des fichiers utilisateur
* La suppression des fichiers

---

## 🚀 Fonctionnalités

### 👤 Authentification

* Création de compte
* Connexion avec JWT

### 📤 Téléversement de fichier

* Upload de fichiers (max 1GB)
* Génération d’un lien unique
* Définition d’une expiration (1 à 7 jours)

### 📥 Téléchargement

* Téléchargement via token
* Téléchargement via lien

### 📂 Gestion des fichiers

* Consultation de l’historique
* Suppression des fichiers

---

## 🛠️ Stack technique

* **Back-end** : Spring Boot 
* **Front-end** : Angular
* **Sécurité** : Spring Security + JWT
* **Base de données** : PostgreSQL et H2 pour les test E2E
* **Stockage** : système de fichiers local
* **Tests** : JUnit + MockMvc

---

## ⚙️ Installation et exécution

### 1. Cloner le repository

```bash
git clone https://github.com/Abderrazzak20/Projet3_datashare.git
cd datashare
```

---

### 2. Configuration

Définir les variables d’environnement :

```bash
JWT_SECRET_KEY=cles pour le token
```
JWT_EXPIRATION=le temp avant que le token expire
---
DB_USER=le nome de la base de donne
---
DB_PASSWORD=le mot de passe de la base de donne
---

### 3. Lancer l’application

```bash
mvn spring-boot:run
```

Application disponible sur :

```
http://localhost:8080
```

---

## 🔐 Authentification

Les endpoints protégés nécessitent :

```
Authorization: Bearer <JWT_TOKEN>
```


## 🧪 Tests

Lancer les tests :

```bash
mvn test
```

Contenu :

* Tests end-to-end :

  * inscription + connexion
  * échec de connexion
  * upload + téléchargement

Couverture : ~74%

---

## 🔒 Sécurité

* Mots de passe hashés avec BCrypt
* Authentification JWT
* Validation des fichiers :

  * taille max : 1GB
  * extensions interdites (.exe, .bat, .sh)
