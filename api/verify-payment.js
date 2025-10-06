export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { transaction_id } = req.query;

  if (!transaction_id) {
    return res.status(400).json({ message: "transaction_id manquant" });
  }

  try {
    const response = await fetch(`https://api.lygos.net/v1/payments/${transaction_id}`, {
      headers: {
        "Authorization": `Bearer ${process.env.LYGOS_API_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur Lygos:", data);
      return res.status(500).json({ message: "Erreur lors de la vérification du paiement" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur Lygos:", error.message);
    return res.status(500).json({ message: "Erreur serveur lors de la vérification du paiement" });
  }
}
