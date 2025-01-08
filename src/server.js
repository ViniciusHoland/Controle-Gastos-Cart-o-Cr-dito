const express = require('express')
const databaseCard = require('./databaseCards.js')

const app = express()
const port = 3004

app.use(express.json())


app.post('/cards', (req, res, next) => {
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
        const cardSaved = databaseCard.saveCard(newCard);

        // Retorna o cartão salvo
        res.status(201).json(cardSaved);
    } catch (error) {
        // Tratamento genérico de erros
        console.error(error);
        res.status(500).json({ error: "Internal server error, please try again later" });
    }
});


app.get('/cards', (req,res,next) => {

    const allCards = databaseCard.getCards()

    res.status(200).json(allCards)

})


app.post('/cards/:id/accounts',(req,res,next) => {

    const idCard = req.params.id
    const {description, amount, parcel, currentMonth} = req.body

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


    if (!currentMonth || typeof currentMonth !== 'string' || description.trim() === '') {
        return res.status(400).json({ error: "Mes Atual é obrigatória e deve ser um campo válido."});
    }

    const bolleanMothIsCurrent = currentMonth === "true"

    const account = { 

        description : description.trim(),
        amount,
        parcel,

    }

    try{
        const accountSaved = databaseCard.savedAccountInCard(idCard,account,bolleanMothIsCurrent)
        res.status(201).json(accountSaved)
    } catch (error) {
        res.status(400).json({error: error.message})
    }


})

app.listen(port, () => {
    console.log('projeto rodando na porta ' + port)
})
