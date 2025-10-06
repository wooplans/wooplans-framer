export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { amount, currency, email, callback_url } = req.body;

    if (!amount || !currency || !email) {
      return res.status(400).json({ message: "Paramètres manquants" });
    }

    const response = await fetch("https://api.lygos.net/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LYGOS_API_KEY}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        email,
        callback_url,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur Lygos:", data);
      return res.status(500).json({ message: "Erreur lors de la création du paiement" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur Lygos:", error.message);
    return res.status(500).json({ message: "Erreur serveur lors de la création du paiement" });
  }
}
