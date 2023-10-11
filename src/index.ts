import { Request, Response } from "express";
import { CreateInvoice, MakePushUSSD } from "./payment_function";

const bodyParser = require('body-parser');
const express = require("express");
const app = express();

const PORT = 3000;


app.use(bodyParser());

app.get("/api/payement", (req: Request, res: Response) => {
  res.send("Bonjour, mon ami");
});

app.post("/api/payement/", async (req: Request, res: Response) => {
  try {
    const payer_msisdn: string = req.body.phone;
    const amount: number = parseFloat(req.body.montant);
    const payment_system_name: string = req.body.operateur;
    const payer_email: string = req.body.email;
    const short_description: string = "Paiement de la consultation";

    let external_reference = "0123456789";

    const result = await CreateInvoice({ payer_msisdn, short_description, amount, payer_email, external_reference });
    console.log(result);

    const bill_id: string = result.e_bill.bill_id;

    const push = await MakePushUSSD({payer_msisdn, bill_id, payment_system_name});
    console.log(push);

    // Répondre seulement une fois à la fin de la route
    res.send("Facture générée et push USSD généré avec succès.");
  } catch (e) {
    console.log(e);
    // En cas d'erreur, répondez avec un message d'erreur
    // res.status(500).send("Une erreur s'est produite : " + e.message);
  }
});

app.listen(PORT, () => {
  console.log(`Serveur ouvert sur ${PORT}`);
});
