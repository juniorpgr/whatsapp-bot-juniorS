const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// ⚠️ Token nuevo (luego pasarlo a variables de entorno en Render)
const TOKEN =
  "EAAWWIDWwrGEBQL19Tva3ZBuc9UvCf4REjPtnYOUv91ZB6Yqh7xQw8BX3mpabTrtXxgFAmMptlrW21emhJh4E8xGRpd1c6ktHqzvYunmfiVUNnnx6NbaZCTNhZBt8edRSz3EmQJS61VASKKcfRenZAYeP91nZCvlZB0ItlZBjnXM0sy5fvNZCzNegY2WC9sJ8VQoRCb8b6IfmxhnMtmX3nlWm7EBiqAWVpE36Tw7F793vgakawhzl8E3UBBVhfyQWWAu4ZAX8nZCuh20Jx2K3ZBQZCP0KY0ZC3e";

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
// WEBHOOK DE MENSAJES (BOT)
// =====================================================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];
    const from = message?.from;

    // 🟦 BOTÓN DEL MENÚ PRESIONADO
    if (message?.interactive?.button_reply?.id) {
      const btn = message.interactive.button_reply.id;

      if (btn === "catalogo_btn") {
        await sendText(from, "📘 Catálogo oficial:\nhttps://www.tambo.pe/pedir");
      }

      if (btn === "promos_btn") {
        await sendText(
          from,
          "🔥 Promociones:\nhttps://www.tambo.pe/pedir/categoria/DmkRzCMmpx97sxReq"
        );
      }

      if (btn === "ubicaciones_btn") {
        await sendText(
          from,
          "📍 Encuentra tu Tambo+ más cercano:\nhttps://www.tambo.pe/locales/"
        );
      }

      if (btn === "asesor_btn") {
        await sendText(
          from,
          "💬 Un asesor se comunicará contigo pronto. ¡Gracias por tu paciencia! 🙏"
        );
      }

      return res.sendStatus(200);
    }

    // 🟩 MENSAJES DE TEXTO
    if (message?.text) {
      const msg = message.text.body.toLowerCase();
      console.log("Mensaje recibido:", msg);

      // 1️⃣ BIENVENIDA
      if (["hola", "buenas", "hi"].includes(msg)) {
        await sendText(
          from,
          "Hola 👋, bienvenido al *Bot de Tambo+*. ¿En qué puedo ayudarle?"
        );
        await sendMenu(from);
        return res.sendStatus(200);
      }

      // 2️⃣ MOSTRAR MENÚ
      if (msg.includes("menu") || msg.includes("opciones") || msg.includes("tambo")) {
        await sendMenu(from);
        return res.sendStatus(200);
      }

      // 3️⃣ MENSAJE DESCONOCIDO
      await sendText(
        from,
        "No entendí 😅\nEscriba *algo* o *menu* para ver las opciones disponibles."
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.log("Error:", error);
    res.sendStatus(500);
  }
});


// =====================================================
// FUNCIÓN: ENVIAR TEXTO (API V24)
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
// FUNCIÓN: MENÚ PRINCIPAL CON BOTONES (API V24)
// =====================================================
async function sendMenu(to) {
  await axios.post(
    `https://graph.facebook.com/v24.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "Seleccione una opción del *Menú Tambo+* 🟦"
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: { id: "catalogo_btn", title: "📘 Catálogo" }
            },
            {
              type: "reply",
              reply: { id: "promos_btn", title: "🔥 Promociones" }
            },
            {
              type: "reply",
              reply: { id: "ubicaciones_btn", title: "📍 Ubicaciones" }
            },
            {
              type: "reply",
              reply: { id: "asesor_btn", title: "💬 Asesor" }
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
// INICIAR SERVIDOR (RENDER FIX)
// =====================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Bot corriendo correctamente en puerto ${PORT}`);
});
