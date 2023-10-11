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
  // Récupération des paramètres POST / téléphone, montant, opérateur, email
  try{
    const payer_msisdn: string = req.body.phone;
    const amount: number = parseFloat(req.body.montant);
    const payment_system_name: string = req.body.operateur;
    const payer_email: string = req.body.email;
    const short_description: string = "Paiement de la consultation";
  
    // Génération d'un numéro unique => external_reference
    let external_reference = "0123456789";
  
    // Création de la facture
    const result = await CreateInvoice({ payer_msisdn, short_description, amount, payer_email, external_reference });
    res.send("success")
    console.log(result);
    
  } catch(e){
    console.log(e)
  }
});

app.listen(PORT, () => {
  console.log(`Serveur ouvert sur ${PORT}: `);
});
