# 📦 DataShare

DataShare est une application web permettant de téléverser et de partager des fichiers via des liens de téléchargement temporaires.

## 🔢 Technologies utilisées

### Frontend
- Angular 19.2.0
- Angular CLI 19.2.22
- TypeScript 5.7.2
- Node.js 20.20.0
- npm 10.8.2

### Backend
- Java 17
- Spring Boot 3.5.14
- Spring Security
- Spring Data JPA
- JWT 0.11.5
- Springdoc OpenAPI 2.8.6
- H2 (tests unitaires )

### Base de données
- PostgreSQL (géré avec pgAdmin)

---

## 🛠️ Installation

### 1. Cloner le dépôt
```bash
git clone https://github.com/Abderrazzak20/Projet3_datashare.git
cd datashare
```

### 2. Configuration de la base de données
Assurez-vous que PostgreSQL est en cours d'exécution, puis initialisez la base de données :
```bash
psql -U postgres -f database/init.sql
```

### 3. Variables d'environnement
Créez un fichier `.env` à la racine du projet avec les configurations suivantes :
```env
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRATION=3600000

DB_URL=jdbc:postgresql://localhost:5432/datashare
DB_USER=identifiant_base
DB_PASSWORD=mot_de_passe
```

---

## ▶️ Lancement de l'application

### Backend (Spring Boot)
```bash
mvn spring-boot:run
```
*Backend disponible sur : http://localhost:8080*

### Frontend (Angular)
```bash
cd frontend
npm install
npm start
```
*Frontend disponible sur : http://localhost:4200*

---

## 🚀 Automatisation (Script de déploiement)

Un script Bash est disponible pour lancer rapidement l'intégralité de l'application :
```bash
chmod +x deploy.sh
./deploy.sh
```

**Note :** Assurez-vous que PostgreSQL est démarré avant l'exécution du script.

## ✨ Fonctionnalités

DataShare permet de téléverser, gérer et partager des fichiers de manière sécurisée grâce à des liens uniques

### 📤 Gestion des fichiers
- Upload de fichiers par les utilisateurs authentifiés
- Génération automatique d’un lien unique de téléchargement
- Téléchargement via lien public sécurisé
- Suppression manuelle des fichiers

### 👤 Gestion des utilisateurs
- Inscription et authentification sécurisée
- Connexion via JWT (token d’accès)
- Accès à un espace personnel ("Mon espace")

### ⏱️ Gestion des fichiers temporaires
- Définition d’une durée de validité pour chaque fichier
- Expiration automatique des fichiers
- Suppression des fichiers expirés par un job backend

### 📚 Suivi et historique
- Consultation des fichiers uploadés
- Accès aux liens générés
- Gestion des fichiers depuis l’espace utilisateur

### 🔐 Sécurité
- Authentification basée sur JWT
- Mots de passe chiffrés
- Accès protégé aux ressources
