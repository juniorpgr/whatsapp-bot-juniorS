const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const TOKEN = "EAAWWIDWwrGEBQGvhdUdZCXfydwpD7hF9xdZCuoqd1je0Xd7SOAzP8ZBqwoWnYAiymzBlsl4w3JD9DfAZAmVBatxUh4vCjT36I2bHZAHpeQMn5p6T8PyhqMKBS8w4G1OFs2zFZAKbCTM1DZBhFAehxYaAHfXh7gWjC4qfDJU7FTofWpJpUFz5zWfvGmZAbz8ptnHRdUTHOWstmT0z4fvexIxd7l3Jafm1wSrqAtkZBwbSAiRDpAbqE9i30nJFURZBnBsTbtZByvLDh6z07oRUjW6wCrSdihA";
const PHONE_NUMBER_ID = "797396630134831";
const VERIFY_TOKEN = "botjunior";

// Webhook de verificación
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

// Recepción de mensajes
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];

    if (message && message.text) {
      const from = message.from;
      const text = message.text.body.toLowerCase();

      await sendMessage(from, "Hola 👋 soy el bot de Tambo+.\nEscribe *PDF* para recibir el documento.");
    }

    res.sendStatus(200);
  } catch (e) {
    console.log("Error:", e);
    res.sendStatus(500);
  }
});

// Función para enviar mensaje
async function sendMessage(to, text) {
  await axios.post(
    `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
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

app.listen(3000, () => console.log("Bot corriendo en http://localhost:3000"));
