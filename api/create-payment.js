const fetch = require('node-fetch'); // Ou utilise built-in fetch en Node 18+

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { amount, orderId, shopName } = req.body; // Récupère du client
  const payload = {
    amount,
    shop_name: shopName || "Wooplan",
    order_id: orderId,
    message: "Paiement Wooplans",
    success_url: `https://wooplans.com/success?order=${orderId}`,
    failure_url: `https://wooplans.com/failure?order=${orderId}`
  };

  try {
    const response = await fetch("https://api.lygosapp.com/v1/gateway", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.LYGOS_API_KEY // Stocke ta clé en env var Vercel
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Erreur Lygos");
    const data = await response.json();
    res.json({ link: data.link });
  } catch (error) {
    res.status(500).json({ error: "Échec création paiement" });
  }
};
