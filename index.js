const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// ⚠️ Luego lo pasamos a variables de entorno
const TOKEN = "EAAWWIDWwrGEBQCN7OyVgAzRtAJxbdD9qYMtBt83cC4d8Dp1mtzt1kiv8QMH8LyWsyASkm1Xj6A6NRoUDJnpKtIGZBaJU89VCHZBZCgnPrlKDNmV1LTxcZBTzQObw2dQaKFDhHma7h1k0qu9RJ2lF4TWJAVhI5vgPC7EEzj9ObyGJvNjseB9296YxR9ZBP6IoRYhOUFVEF3xfzOoIRtZCoFcaOcqqvZAHadwBTG5w3Pc8P3rtsahP7OtyAyvZANWYsv4PBueTV0QvpFhVlspeLRFaDizv";
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

    // 🟦 CAPTURAR CLICK EN BOTÓN (reply button)
    if (message?.interactive?.button_reply?.id === "catalogo_btn") {
      await sendText(
        from,
        "📘 Aquí tienes el catálogo oficial de Tambo+ 👇\nhttps://www.tambo.pe/pedir"
      );
      return res.sendStatus(200);
    }

    // 🟩 CAPTURAR MENSAJES DE TEXTO
    if (message && message.text) {
      const msg = message.text.body.toLowerCase();
      console.log("Mensaje recibido:", msg);

      // 1️⃣ BIENVENIDA
      if (["hola", "buenas", "hi"].includes(msg)) {
        await sendText(
          from,
          "Hola 👋, bienvenido al *Bot de Tambo+*. ¿En qué puedo ayudarlo?"
        );
        return res.sendStatus(200);
      }

      // 2️⃣ CATÁLOGO (envía botón)
      if (msg.includes("catalogo") || msg.includes("catálogo")) {
        await sendCatalogButton(from);
        return res.sendStatus(200);
      }

      // 3️⃣ MENSAJE POR DEFECTO
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


// =====================================================
// FUNCIÓN: ENVIAR TEXTO
// =====================================================
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


// =====================================================
// FUNCIÓN: BOTÓN CATÁLOGO (REPLY BUTTON)
// COMPATIBLE CON TODAS LAS CUENTAS
// =====================================================
async function sendCatalogButton(to) {
  await axios.post(
    `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: "Haz clic para abrir el catálogo 👇" },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "catalogo_btn",
                title: "📘 Ver Catálogo"
              }
            }
          ]
        }
      }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      }
    }
  );
}


// =====================================================
// INICIAR SERVIDOR
// =====================================================
app.listen(3000, () =>
  console.log("Bot corriendo en http://localhost:3000")
);
