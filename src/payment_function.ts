import axios, { AxiosError } from 'axios';
import { encode as base64Encode } from 'base-64';

// Lien de la documentation officiel
// https://drive.google.com/drive/folders/1VMYhONnZ8-qwBEgiyKjjWnG2TWKCPy1I

const username = 'gabin';
const sharedkey = '6639fcf7-7ce2-4fa4-a768-1a9d8ac4678b';
const domain = 'https://lab.billing-easy.net/api/v1/'; // Lien pour l'environnement de test

const credentials = `${username}:${sharedkey}`;
const encodedCredentials = base64Encode(credentials); // Changer la 'base64.encode' en 'base64Encode'

const requestHeaders = {
    'Content-type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Basic ' + encodedCredentials,
};

const api = axios.create({
    baseURL: domain,
    headers: requestHeaders
});

// Format de donné pour la création de la facture
interface InvoiceData {
    amount: number;
    payer_msisdn: string;
    payer_email: string;
    short_description: string;
    external_reference: string;
    description?: string;
    expiry_period?: string;
}

// Format de donné pour faire un push
interface PushUssdData {
    bill_id  : string, 
    payer_msisdn : string,
    payment_system_name : string
}


interface PayoutRequireData{
    payee_msisdn : string,
    amount : string,
    external_reference : string,
    payout_type : string,
}

// Format de donné pour faire une demande de paiement
interface PropertyName{
    payment_system_name : string,
    payer_pin : string,
    payer_client_id : string,
    payer_client_secret_key : string,
    payouts : PayoutRequireData
}


export async function CreateInvoice(data: InvoiceData){

   try{
        {/**
            HTTP/1.1 200 OK RETURN RESPONSE DATA

            {
                "client_transaction_id":"001",
                "server_transaction_id":"0000000000001",
                "e_bill":{
                "bill_id":"5550000001",
                "payer_msisdn":"4362752893",
                "payer_email":"leola.bernier@haneconn.com",
                "payee_id":"9016529699",
                "payee_name":"merchant",
                "amount":100,
                "currency":"XAF",
                "state":"ready",
                "created_at":"2013-12-29T18:03:10.009+08:00",
                "expire_at":"2013-07-25T01:51:29.000+08:00",
                "schedule_at":null,
                "updated_at":"2013-12-29T18:03:10.009+08:00",
                "short_description":"short_description",
                "due_date":"2013-10-31",
                "external_reference":null,
                "additional_info":null,
                "description":"description",
                "reason":null,
                "accept_partial_payment": false,
                "minimum_amount": 0
            }
        */}

        const { payer_msisdn, amount, short_description, payer_email, description, external_reference, expiry_period } = data;

        const response = await api.post('/merchant/e_bills.json', {
            payer_msisdn,
            amount,
            short_description,
            payer_email,
            description,
            external_reference,
            expiry_period,
        });

        return response.data

   }catch(error){
        console.error('Erreur lors de la création de la facture :', error);
        throw error;
   }

}

export async function MakePushUSSD(data : PushUssdData ){

    const { payer_msisdn, bill_id , payment_system_name } = data;

    api.post(`/merchant/e_bills/${bill_id}/ussd_push`, {payer_msisdn,payment_system_name}).then((response)=>{
        return response.data
    }).catch((error)=>{
        throw error.response ? error.response.data.errors : error;
    })

}

export async function GetInvoice(bill_id : string){

    try {
        {/** 
            HTTP/1.1 200 OK RETURN RESPONSE DATA

            {
                "bill_id":"5550000001",
                "payer_msisdn":"4362752893",
                "payer_email":"leola.bernier@haneconn.com",
                "payee_id":"9016529699",
                "payee_name":"merchant",
                "amount":100,
                "currency":"XAF",
                "state":"processed",
                "ps_transaction_id":"MP210817.2353.A90673",
                "payment_system_name":"airtelmoney",
                "created_at":"2013-12-29T18:03:10.009+08:00",
                "expire_at":"2013-07-25T01:51:29.000+08:00",
                "updated_at":"2013-12-29T18:03:10.009+08:00",
                "short_description":"short_description",
                "due_date":"2013-10-31",
                "external_reference":null,
                "additional_info":null,
                "description":"description",
                "reason":null
                }
        */}

        const response = await api.get(`/merchant/e_bills/${bill_id}.json`)
        return response.data;

    }catch (error) {

        if (error instanceof AxiosError) {
            console.error('Erreur lors de la recuperation de la facture :', error.response?.data);
            throw error.response?.data;
        } else {
            console.error('Erreur inattendue :', error);
            throw error;
        }
    }

}

export async function CreatePayout(data : PropertyName){

    try {
        const response = await api.get('/merchant/payouts', { data });
        return response.data;
    }catch (error) {
        if (error instanceof AxiosError) {
            console.error('Erreur lors de la création du paiement :', error.response?.data);
            throw error.response?.data;
        } else {
            console.error('Erreur inattendue :', error);
            throw error;
        }
    }
}