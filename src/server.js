const express = require('express')
const databaseCard = require('./databaseCards.js')

const app = express()
const port = 3004

app.use(express.json())


app.post('/cards', (req,res,next) => {

    const newCard = {
        title: req.body.title,
        date: req.body.date 
    }

    const cardSaved = databaseCard.saveCard(newCard)

    res.status(201).json(cardSaved)

})

app.get('/cards', (req,res,next) => {

    const allCards = databaseCard.getCards()

    res.status(200).json(allCards)

})


app.post('/cards/:id/accounts',(req,res,next) => {

    const idCard = req.params.id
    const {description, amount, parcel} = req.body

    // Validação de dados
    if (!description || typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({ error: "Descrição é obrigatória e deve ser uma string válida." });
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: "O valor deve ser um número maior que zero." });
    }
    if (!parcel || typeof parcel !== 'number' || parcel <= 0) {
        return res.status(400).json({ error: "A parcela deve ser um número maior que zero." });
    }

    const account = { 

        description : description.trim(),
        amount,
        parcel

    }

    try{
        const accountSaved = databaseCard.savedAccountInCard(idCard,account)
        res.status(201).json(accountSaved)
    } catch (error) {
        res.status(400).json({error: error.message})
    }


})

app.listen(port, () => {
    console.log('projeto rodando na porta ' + port)
})
