#!/bin/bash

echo "🚀 Démarrage de l'application DataShare..."

# =========================
# BACKEND
# =========================
echo "📦 Lancement du backend..."
cd backend || exit
mvn spring-boot:run &

# Pause pour laisser le backend démarrer
sleep 5

# =========================
# FRONTEND
# =========================
echo "💻 Lancement du frontend..."
cd ../frontend/datashare-frontend || exit
npm install
npm start

echo "✅ Application démarrée avec succès !"