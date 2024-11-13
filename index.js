const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
require('dotenv').config();

const GOOGLE_CLOUD_CREDENTIALS = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
// Inicializando o Firebase Admin

admin.initializeApp({
    credential: admin.credential.cert(GOOGLE_CLOUD_CREDENTIALS)
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analisar o corpo da requisição
app.use(bodyParser.json());

// Rota para enviar notificações
app.post('/send-notification', (req, res) => {
    const { registrationToken, title, body } = req.body;
    console.log(req)

    if (!registrationToken || !title || !body) {
        return res.status(400).send(`Token de registro, título e corpo são obrigatórios.\nToken: ${registrationToken}\nTitulo: ${title}\nCorpo: ${body}`);
    }

    const message = {
        notification: {
            title: title,
            body: body
        },
        token: registrationToken
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log('Mensagem enviada com sucesso:', response);
            return res.status(200).send('Notificação enviada com sucesso!');
        })
        .catch((error) => {
            console.log('Erro ao enviar a mensagem:', error);
            return res.status(500).send('Erro ao enviar a notificação.');
        });
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});