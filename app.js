app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object) {

    const axios = require("axios");

    // 🔥 DETECTAR MENSAJE RECIBIDO
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from; // Número del usuario
      const text = message.text?.body || ""; // Texto recibido

      // 🔥 RESPONDER MENSAJE AUTOMÁTICO
      axios({
        method: "POST",
        url: `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Hola 👋, soy el bot de Junior. ¿En qué puedo ayudarte?" }
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
        }
      })
        .then(() => console.log("Mensaje enviado ✔"))
        .catch((err) => console.error("Error enviando mensaje:", err));
    }

    res.sendStatus(200); // ✔ SIEMPRE responder 200 para que WhatsApp no marque error
  } else {
    res.sendStatus(404);
  }
});
