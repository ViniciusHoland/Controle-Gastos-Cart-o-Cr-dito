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

    try {
        const allCards = await Card.find()

        if (!allCards || allCards.length === 0) {
            return res.status(404).json({ error: "cards not found" });
        }

        res.status(200).json(allCards)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error for found cards" });
    }

})

app.put('/cards/:id', async (req, res, next) => {

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

        const card = await Card.findById(idCard)

        card.title = title
        card.date = date 

        // Salva o cartão no banco de dados
        card.save() 

        // Retorna o cartão salvo
        res.status(201).json(card);

    } catch (error) {
        // Tratamento genérico de erros
        console.error(error);
        res.status(500).json({ error: "Internal server error, please try again later" });
    }

})


app.post('/cards/:id/accounts', async (req, res, next) => {

    const idCard = req.params.id
    const { description, amount, parcel, currentMonth } = req.body

    // Validação de dados

    if (!description || !amount || !parcel || currentMonth === undefined) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const bolleanMothIsCurrent = currentMonth === "true"

   
    try {

        const card = await Card.findById(idCard)

        if (!card) {
            return res.status(404).json({ error: "card not found." });
        }

        const parcelValue = parseFloat((amount / parcel).toFixed(2))
        const parcels = []

        const currentDate = new Date()
        currentDate.setDate(card.date)// define o dia do vencimento

        const currentMonthOffset = bolleanMothIsCurrent  ? 0 : 1

        for (let i = 0; i < parcel; i++) {

            const dueDate = new Date(currentDate) // cria uma nova data com base na data Inicial
            dueDate.setMonth(currentDate.getMonth() + i + currentMonthOffset) // incrementa 1 mes a cada parcela matendo o dia de vencimento

            const formattedDate = `${String(dueDate.getDate()).padStart(2, "0")}/${String(
                dueDate.getMonth() + 1
            ).padStart(2, "0")}/${dueDate.getFullYear()}`;


            parcels.push({
                description: description.trim(),
                parcel: i + 1,
                parcelAmount: parcelValue,
                dueDate: formattedDate // formata a data 
            })
        }

        const newAccount = {
            parcels, // adiciona as parcelas
        }

        card.accounts.push(newAccount)

        await card.save()

        res.status(201).json({
            message: 'Account created with sucessfully!',
            cardId: card._id,
            account: newAccount
        });

    }

    catch (error) {
        console.error(error)
        res.status(400).json({ error: "error for created card" })
    }


})

app.delete('/cards/:id/accounts', async (req, res, next) => {
    try {
        const idCard = req.params.id;
        const idAccount = req.body.idAccount;

        const card = await Card.findById(idCard)

        if (!card) {
            return res.status(404).json({ error: "Card not found." });
        }

        const accountIndex = card.accounts.findIndex(account => account._id.toString() === idAccount)

        if (accountIndex === -1) {
            return res.status(404).json({ error: "Account not found." });
        }

        const accountRemoved = card.accounts.splice(accountIndex, 1)[0]

        await card.save()
        res.status(200).json({ message: "Account deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error deleting account." });
    }

})
/*

app.delete('/cards/:id', (req, res, next) => {

    const idCard = req.params.id

    const cardToDelete = databaseCard.deleteCard(idCard)

    res.status(200).json(cardToDelete)

})*/


app.listen(port, () => {
    console.log('projeto rodando na porta ' + port)
})
