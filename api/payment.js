import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { amount, currency, message, success_url, failure_url } = req.body;

    // Validation simple
    if (!amount || !currency || !message) {
      return res.status(400).json({ message: "Champs manquants dans la requête" });
    }

    // Appel à l'API Lygos
    const response = await fetch("https://api.lygosapp.com/v1/gateway", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer lygossandbox-876dab2b-6711-49c3-b0ff-a3070aa4946a"
      },
      body: JSON.stringify({
        amount,
        currency,
        message,
        shop_name: "WooPlans Sandbox",
        success_url,
        failure_url
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur Lygos:", data);
      return res.status(500).json({ message: "Erreur Lygos", details: data });
    }

    // Renvoie le lien de paiement au frontend Framer
    return res.status(200).json({
      success: true,
      link: data.link || null,
      lygos_response: data
    });

  } catch (error) {
    console.error("Erreur API:", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}
