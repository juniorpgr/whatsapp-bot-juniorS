const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// ⚠️ TE RECOMIENDO luego pasarlo a variables de entorno:
const TOKEN = "EAAWWIDWwrGEBQCN7OyVgAzRtAJxbdD9qYMtBt83cC4d8Dp1mtzt1kiv8QMH8LyWsyASkm1Xj6A6NRoUDJnpKtIGZBaJU89VCHZBZCgnPrlKDNmV1LTxcZBTzQObw2dQaKFDhHma7h1k0qu9RJ2lF4TWJAVhI5vgPC7EEzj9ObyGJvNjseB9296YxR9ZBP6IoRYhOUFVEF3xfzOoIRtZCoFcaOcqqvZAHadwBTG5w3Pc8P3rtsahP7OtyAyvZANWYsv4PBueTV0QvpFhVlspeLRFaDizv";
const PHONE_NUMBER_ID = "797396630134831";
const VERIFY_TOKEN = "botjunior";

// ==============================
// WEBHOOK DE VERIFICACIÓN
// ==============================
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

// ==============================
// RECEPCIÓN DE MENSAJES
// ==============================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];

    if (message && message.text) {
      const from = message.from;
      const msg = message.text.body.toLowerCase();

      console.log("Mensaje recibido:", msg);

      // ==============================
      // 1️⃣ MENSAJE DE BIENVENIDA
      // ==============================
      if (msg === "hola" || msg === "buenas" || msg === "hi") {
        await sendText(
          from,
          "Hola 👋, bienvenido al *Bot de Tambo+*. ¿En qué le puedo ayudar?"
        );
        return res.sendStatus(200);
      }

      // ==============================
      // 2️⃣ BOTÓN DEL CATÁLOGO
      // ==============================
      if (msg.includes("catalogo") || msg.includes("catálogo")) {
        await sendCatalogButton(from);
        return res.sendStatus(200);
      }

      // ==============================
      // 3️⃣ RESPUESTA POR DEFECTO
      // ==============================
      await sendText(
        from,
        "No entendí bien 😅\nEscriba *hola* o *catalogo* para ver opciones."
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.log("Error:", error);
    res.sendStatus(500);
  }
});

// ==============================
// FUNCIÓN ENVIAR TEXTO
// ==============================
async function sendText(to, text) {
  await axios.post(
    `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
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

// ==============================
// FUNCIÓN BOTÓN DEL CATÁLOGO
// ==============================
async function sendCatalogButton(to) {
  await axios.post(
    `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: "Aquí tienes el catálogo 👇" },
        action: {
          buttons: [
            {
              type: "url",
              url: {
                link: "https://www.tambo.pe/pedir",
                text: "📘 Ver Catálogo",
              },
            },
          ],
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }a
}

app.listen(3000, () => console.log("Bot corriendo en http://localhost:3000"));
