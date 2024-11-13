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
    const { token, notification, data, priority } = req.body;

    if (!token) {
        return res.status(400).send(`Token de registro é obrigatório.`);
    }

    const message = {
        notification: notification || {},
        token: token,
        data: data || {},
        android: {
            priority: priority || 'high'  // Indicação de alta prioridade
        }
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log(response)
            return res.status(200).send('Notificação enviada com sucesso!');
        })
        .catch((error) => {
            return res.status(500).send('Erro ao enviar a notificação.');
        });
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});