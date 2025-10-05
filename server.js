import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Clé secrète Lygos
const LYGOS_SECRET_KEY = process.env.LYGOS_SECRET_KEY;

// ✅ Route pour créer un paiement
app.post("/create-payment", async (req, res) => {
  try {
    const { amount, name, email } = req.body;

    const response = await axios.post(
      "https://api.lygos.cm/v1/payments",
      {
        amount,
        currency: "XAF",
        customer_name: name,
        customer_email: email,
        callback_url: "https://gray-team-354103.framer.app/payment-success"
      },
      {
        headers: {
          Authorization: `Bearer ${LYGOS_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erreur Lygos:", error.response?.data || error.message);
    res.status(500).json({ message: "Erreur lors de la création du paiement" });
  }
});

// ✅ Webhook pour confirmation de paiement
app.post("/lygos-webhook", (req, res) => {
  const event = req.body;
  console.log("📩 Webhook reçu :", event);
  // TODO: mettre à jour la base de données ici selon le statut du paiement
  res.status(200).send("OK");
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 API Wooplans-Lygos opérationnelle !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
