const express = require('express')
const databaseCard = require('./databaseCards.js')
const connectDB = require('./database.js')
const Card = require('../models/card.js')

const app = express()
const port = 3004

connectDB()

app.use(express.json())


app.post('/cards', async (req, res, next) => {
    try {
        const { title, date } = req.body;

        // Validações dos dados de entrada
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: "O título é obrigatório e deve ser uma string válida." });
        }

        if (!date || typeof date !== 'number' || date <= 0 || date > 31) {
            return res.status(400).json({ error: "A data de vencimento deve ser um número entre 1 e 31." });
        }

        // Criação do novo cartão
        const newCard = {
            title: title.trim(),
            date
        };

        const card = new Card(newCard)

        card.save().then((savedCard) => {
            console.log("Card saved with ID: ", savedCard)

            res.status(201).json({
                message: 'Card build with sucessfull'
            })

        })


    } catch (error) {
        // Tratamento de erros
        console.error(error);
        res.status(500).json({ error: "Internal server error, please try again later" });
    }
});


app.get('/cards', async (req, res, next) => {

    try{
        const allCards = await Card.find()

        if(!allCards || allCards.length ===0){
            return res.status(404).json({ error: "cards not found" });
        }

        res.status(200).json(allCards)

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error for found cards" });
    }

})

/*app.put('/cards/:id', (req, res, next) => {

    const idCard = req.params.id

    try {
        const { title, date } = req.body;

        // Validações dos dados de entrada
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: "O título é obrigatório e deve ser uma string válida." });
        }

        if (!date || typeof date !== 'number' || date <= 0 || date > 31) {
            return res.status(400).json({ error: "A data de vencimento deve ser um número entre 1 e 31." });
        }

        // Criação do novo cartão
        const newCard = {
            title: title.trim(),
            date
        };

        // Salva o cartão no banco de dados
        const cardSaved = databaseCard.saveCard(newCard, parseInt(idCard));

        // Retorna o cartão salvo
        res.status(201).json(cardSaved);

    } catch (error) {
        // Tratamento genérico de erros
        console.error(error);
        res.status(500).json({ error: "Internal server error, please try again later" });
    }

})*/


app.post('/cards/:id/accounts', async (req, res, next) => {

    const idCard = req.params.id
    const { description, amount, parcel, currentMonth } = req.body

    // Validação de dados

    if (!description || !amount || !parcel || !currentMonth) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const bolleanMothIsCurrent = currentMonth === "true"

    try {

        const card = await Card.findById(idCard)

        if (!card) {
            return res.status(404).json({ error: "Cartão não encontrado." });
        }


        const newAccount = {

            description: description.trim(),
            amount,
            parcel,
            currentMonth: bolleanMothIsCurrent

        }

        card.accounts.push(newAccount)

        await card.save()

        res.status(201).json({
            message: 'Account created with sucessfull!',
            cardId: card._id,
            account: newAccount
        });

    }

    catch (error) {
        console.error(error)
        res.status(400).json({ error: "error for created card"})
    }


})

/*app.delete('/cards/:id/accounts', (req, res, next) => {
    try {
        const idCard = req.params.id;
        const idAccount = req.body.idAccount;

        const accountRemoved = databaseCard.deleteAccountToCard(idCard, idAccount);
        res.status(200).json(accountRemoved);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

app.delete('/cards/:id', (req, res, next) => {

    const idCard = req.params.id

    const cardToDelete = databaseCard.deleteCard(idCard)

    res.status(200).json(cardToDelete)

})*/


app.listen(port, () => {
    console.log('projeto rodando na porta ' + port)
})
