module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { amount, orderId, shopName } = req.body;
  if (!amount || !orderId) return res.status(400).json({ error: "Amount et orderId requis" });

  const payload = {
    amount: parseInt(amount), // Assure-toi que c'est un integer
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
        "api-key": process.env.LYGOS_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erreur Lygos: ${response.status} - ${errorData}`);
    }
    const data = await response.json();
    res.json({ link: data.link });
  } catch (error) {
    console.error("Erreur dans create-payment:", error); // Pour les logs Vercel
    res.status(500).json({ error: "Échec création paiement: " + error.message });
  }
};
