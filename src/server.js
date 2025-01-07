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


app.post('/card/:id/accounts',(req,res,next) => {

    const idCard = req.params.id
    const {description, amount, parcel} = req.body

    const account = { 

        description,
        amount,
        parcel

    }

    const accountSaved = databaseCard.savedAccountInCard(idCard,account)

    res.status(201).json(accountSaved)

})

app.listen(port, () => {
    console.log('projeto rodando na porta ' + port)
})
