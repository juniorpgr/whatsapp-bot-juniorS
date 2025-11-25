app.use(express.json());

// VALIDACIÓN GET
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "botjunior";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// RECEPCIÓN DE MENSAJES
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object) {
    console.log(JSON.stringify(body, null, 2));
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});
