# 🌍 Wooplans - Lygos API

API Node.js pour connecter le site Framer **Wooplans** à la plateforme de paiement **Lygos**.

## 🚀 Fonctionnalités
- Création sécurisée de paiements Lygos
- Redirection automatique après paiement
- Réception des webhooks de confirmation

---

## 🧩 Installation locale

```bash
git clone https://github.com/wooplans/wooplans-lygos-api.git
cd wooplans-lygos-api
npm install
cp .env.example .env
# Ajoute ta clé secrète Lygos dans le fichier .env
npm start
```

L’API tournera sur `http://localhost:3000`.

---

## 🌍 Déploiement sur Render

1. Va sur [https://render.com](https://render.com)
2. Crée un **Nouveau Web Service**
3. Connecte ton dépôt GitHub
4. Variables d’environnement :
   - `LYGOS_SECRET_KEY` = ta clé secrète Lygos
5. Build command : `npm install`
6. Start command : `npm start`

Une fois en ligne, l’API sera accessible à une URL du type :
```
https://wooplans-lygos-api.onrender.com
```

---

## 💡 Exemple d’utilisation côté Framer

```js
const res = await fetch("https://wooplans-lygos-api.onrender.com/create-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: 29900,
    name: "Client Wooplans",
    email: "client@example.com"
  }),
});

const data = await res.json();
window.location.href = data.data.authorization_url;
```
---

## 📬 Webhook
Lygos appellera automatiquement `/lygos-webhook` pour notifier du statut d’un paiement.
