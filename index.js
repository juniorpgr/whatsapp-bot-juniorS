const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// TOKEN
const TOKEN = "EAAWWIDWwrGEBQEGtY4O5R0siKxQeEYcTs0gTunGgnkfmMVy0OnZBSvWtMKe523ZBOnP0i0nEbYtdluaJCj8rH4cB0JhZBzMMBDwzQAcfzZBwNzZB2o062FVYgJ0KqtJZB4iQc0hz1jnVwXLgSCROEbAiCT9cmvyDj1cZA8P3f3VFBsWvexI5OvaPf5STZBxl1hZBN55iZBor3GVkYUgazD2H9Ga7w65l6587w3ZAxVjwU4UZCZBNV0QkxmBnJePa2t1ZCYIOZAAtkn3sTk7vuYLEMDd1QkExNnm";
const PHONE_NUMBER_ID = "797396630134831";
const VERIFY_TOKEN = "botjunior";

// =====================================================
// WEBHOOK VERIFICACIÓN
// =====================================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// =====================================================
// WEBHOOK DE MENSAJES
// =====================================================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];
    const from = message?.from;

    if (!message || !from) return res.sendStatus(200);

    // MENSAJE DE TEXTO
    if (message.text) {
      const msg = message.text.body.toLowerCase();
      console.log("Mensaje recibido:", msg);

      // BIENVENIDA
      if (["hola", "buenas", "hi"].includes(msg)) {
        await sendText(
          from,
          "Hola 👋, bienvenido al *Bot de Tambo*. ¿En qué puedo ayudarlo?\n\n" +
          "Escriba una opción:\n" +
          "👉 *catalogo*\n" +
          "👉 *promos*\n" +
          "👉 *ubicaciones*\n" +
          "👉 *asesor*"
        );
        return res.sendStatus(200);
      }

      // CATÁLOGO
      if (msg.includes("catalogo")) {
        await sendText(
          from,
          "📘 *Catálogo Tambo+*\nHaz tu pedido aquí 👇\nhttps://www.tambo.pe/pedir"
        );
        return res.sendStatus(200);
      }

      // PROMOCIONES
      if (msg.includes("promos") || msg.includes("promoción") || msg.includes("promociones")) {
        await sendText(
          from,
          "🔥 *Promociones Tambo+* 🔥\nDisponible aquí 👇\nhttps://www.tambo.pe/pedir/categoria/DmkRzCMmpx97sxReq"
        );
        return res.sendStatus(200);
      }

      // UBICACIONES
      if (msg.includes("ubicaciones") || msg.includes("locales")) {
        await sendText(
          from,
          "📍 *Encuentra tu Tambo+ más cercano:* \nhttps://www.tambo.pe/locales/"
        );
        return res.sendStatus(200);
      }

      // ASESOR
      if (msg.includes("asesor")) {
        await sendText(
          from,
          "💬 Un asesor se comunicará contigo pronto. Gracias por tu paciencia 🙏"
        );
        return res.sendStatus(200);
      }

      // MENSAJE DESCONOCIDO
      await sendText(
        from,
        "No entendí 😅\nEscriba *hola* o una de estas opciones:\n" +
        "catalogo / promos / ubicaciones / asesor"
      );
    }

    res.sendStatus(200);

  } catch (error) {
    console.log("Error:", error);
    res.sendStatus(500);
  }
});

// =====================================================
// FUNCIÓN ENVIAR TEXTO
// =====================================================
async function sendText(to, text) {
  await axios.post(
    `https://graph.facebook.com/v24.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

// =====================================================
// INICIAR SERVIDOR
// =====================================================
app.listen(3000, () => console.log("Bot corriendo en http://localhost:3000"));
