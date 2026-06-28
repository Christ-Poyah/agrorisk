# AgroRisk

Application mobile de gestion anticipative des risques agricoles, propulsée par l'intelligence artificielle.

---

## Description

AgroRisk analyse en temps réel les données météorologiques et satellite pour prédire les risques climatiques menaçant les cultures — sécheresses, inondations, invasions de criquets. En cas d'alerte critique, l'agriculteur reçoit un guide d'urgence étape par étape avec validation photo par l'IA. Lorsqu'un sinistre est confirmé, un smart contract déclenche automatiquement l'indemnisation sur le mobile money de l'agriculteur, sans dossier ni intermédiaire, en quelques heures.

---

## Fonctionnalités

- **Surveillance IA** — analyse météorologique continue avec scores de risque mis à jour toutes les 6h
- **Alertes précoces** — notification critique avec guide d'urgence personnalisé
- **Validation photo** — chaque étape du guide validée par Agro AI via photo
- **Smart Contracts** — indemnisation automatique déclenchée sans intervention humaine
- **Assistant Agro AI** — chatbot disponible 24h/24 pour diagnostic de cultures et recommandations
- **Enregistrement de plantation** — GPS automatique, choix de culture, superficie en 3 étapes

---

## Stack technique

| Composant | Technologie |
|---|---|
| Application mobile | React Native + Expo SDK 51 |
| Navigation | React Navigation (Stack + Bottom Tabs) |
| Icônes | Lucide React Native |
| Typographie | Inter (Google Fonts) |
| État global | Context API |
| Blockchain | Smart contracts (indemnisation automatique) |
| IA | Analyse météorologique, NDVI satellite, prédictions de risque |

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/Christ-Poyah/agrorisk.git
cd agrorisk

# Installer les dépendances
npm install

# Lancer l'application
npx expo start
```

Scanner le QR code avec **Expo Go** (iOS / Android) ou lancer sur émulateur.

---

## Structure du projet

```
src/
├── assets/images/      # Images des cultures et logo
├── components/         # Composants réutilisables (LucideIcon, PlantationCard...)
├── context/            # AppContext — état global
├── data/               # mockData — cultures, régions, données de démonstration
├── navigation/         # AppNavigator — structure de navigation
├── screens/            # Écrans de l'application
│   ├── SplashScreen.js
│   ├── AuthScreen.js
│   ├── OTPScreen.js
│   ├── AddPlantationScreen.js
│   ├── PlantationSummaryScreen.js
│   ├── RiskGuideScreen.js
│   └── ChatbotScreen.js
└── theme.js            # Design system (couleurs, typographie, espacements)
```

---

## Démonstration

1. **Inscription** → saisie du nom et numéro de téléphone
2. **OTP** → code de vérification `248631`
3. **Création de plantation** → choix de la culture, localisation GPS, superficie
4. **Accueil** → après 10 secondes, simulation d'une alerte sécheresse critique
5. **Guide d'urgence** → 6 étapes avec validation photo par Agro AI
6. **Retour** → après 10 secondes, simulation d'une alerte inondation critique
7. **Assistant** → onglet "Assistant IA" pour diagnostic de maladie par photo

---

## Contexte

Projet développé dans le cadre d'un hackathon, centré sur l'impact social en Afrique de l'Ouest. Cible initiale : les petits agriculteurs de Côte d'Ivoire.

---

*AgroRisk — Protéger les agriculteurs d'aujourd'hui pour nourrir l'Afrique de demain.*
