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
    // Récupération des paramètres POST / téléphone, montant, opérateur, email
    try {
        const payer_msisdn = req.body.phone;
        const amount = parseFloat(req.body.montant);
        const payment_system_name = req.body.operateur;
        const payer_email = req.body.email;
        const short_description = "Paiement de la consultation";
        // Génération d'un numéro unique => external_reference
        let external_reference = "0123456789";
        // Création de la facture
        const result = yield (0, payment_function_1.CreateInvoice)({ payer_msisdn, short_description, amount, payer_email, external_reference });
        res.send("success");
        console.log(result);
    }
    catch (e) {
        console.log(e);
    }
}));
app.listen(PORT, () => {
    console.log(`Serveur ouvert sur ${PORT}: `);
});
