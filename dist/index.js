"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const payment_function_1 = require("./payment_function");
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const PORT = 3000;
app.use(bodyParser());
app.get("/api/payement", (req, res) => {
    res.send("Bonjour, mon ami");
});
app.post("/api/payement/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payer_msisdn = req.body.phone;
        const amount = parseFloat(req.body.montant);
        const payment_system_name = req.body.operateur;
        const payer_email = req.body.email;
        const short_description = "Paiement de la consultation";
        let external_reference = "0123456789";
        const result = yield (0, payment_function_1.CreateInvoice)({ payer_msisdn, short_description, amount, payer_email, external_reference });
        console.log(result);
        const bill_id = result.e_bill.bill_id;
        const push = yield (0, payment_function_1.MakePushUSSD)({ payer_msisdn, bill_id, payment_system_name });
        console.log(push);
        // Répondre seulement une fois à la fin de la route
        res.send("Facture générée et push USSD généré avec succès.");
    }
    catch (e) {
        console.log(e);
        // En cas d'erreur, répondez avec un message d'erreur
        // res.status(500).send("Une erreur s'est produite : " + e.message);
    }
}));
app.listen(PORT, () => {
    console.log(`Serveur ouvert sur ${PORT}`);
});
