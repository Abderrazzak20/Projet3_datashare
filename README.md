# 📦 DataShare

## 📖 Description

DataShare est une application web permettant de téléverser et partager des fichiers via des liens de téléchargement temporaires.

---

## 🔢 Versions utilisées

### Frontend
- Angular 19.2.0
- Angular CLI 19.2.22
- TypeScript 5.7.2
- Node.js 20.20.0
- npm 10.8.2

### Backend
- Java 17
- Spring Boot 3.5.0
- Spring Security
- Spring Data JPA
- JWT 0.11.5
- Springdoc OpenAPI 2.8.6

### Database
- PostgreSQL (utilisé avec pgAdmin)

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Abderrazzak20/Projet3_datashare.git
cd datashare
```

---

### 2. Configuration

Créer un fichier `.env` et définir les variables suivantes :

```bash
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRATION=3600000

DB_URL=jdbc:postgresql://localhost:5432/datashare
DB_USER=identifiant_base
DB_PASSWORD=mot_de_passe
```

---

## ▶️ Lancement de l’application

### 🔧 Backend (Spring Boot)

```bash
mvn spring-boot:run
```

Backend disponible sur :  
http://localhost:8080

---

### 💻 Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

Frontend disponible sur :  
http://localhost:4200
