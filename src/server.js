const express = require('express')
const cors = require('cors')
const { connectDB }= require('./database.js')
const Card = require('../models/card.js')

const app = express()
const PORT = process.env.PORT || 3000 

connectDB()

app.use(express.json())
app.use(cors({
    origin: 'https://vocal-babka-e7e20f.netlify.app', // URL do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.post('/cards', async (req, res, next) => {
    try {
        const { title } = req.body;
        const date = Number(req.body.date)

        // Validações dos dados de entrada
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: "O título é obrigatório e deve ser uma string válida." });
        }

        if (!date || isNaN(date) || date <= 0 || date > 31) {
            return res.status(400).json({ error: "A data de vencimento deve ser um número entre 1 e 31." });
        }

        // Criação do novo cartão
        const newCard = {
            title: title.trim(),
            date
        };

        const card = new Card(newCard)

        const savedCard = await card.save();
        console.log("Card saved with ID: ", savedCard);

        res.status(201).json({
            message: 'Card created successfully',
            card: savedCard, // Retorne o card criado (opcional)
        });


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

app.get('/cards/:id', async (req, res, next) => {


    try {

        const idCard = req.params.id
        const card = await Card.findById(idCard)

        if (!card) {
            return res.status(404).json({ error: "Card not found." });
        }

        // Calcular o total da próxima fatura
        const currentDate = new Date();
        const nextDueDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            card.date // Dia do vencimento configurado no cartão
        );
        nextDueDate.setHours(23, 59, 59, 999); // Final do próximo dia de vencimento

        const convertDate = (dateString) => {
            const [day, month, year] = dateString.split("/").map(Number); // Dividir pela "/"
            return new Date(year, month - 1, day); // Criar objeto Date
        };

        // Filtrar contas com parcelas vencendo até o próximo vencimento
        /*const accountsNext = card.accounts.filter((account) =>
            account.parcels.some((parcel) => {
                const parcelDate = convertDate(parcel.dueDate)
                return parcelDate <= nextDueDate;  // Parcelas vencendo até a data configurada
            })
        );

       
        // Filtrar contas com parcelas já vencidas
        const accountsDueNext = accountsNext.filter((account) => 
            account.parcels.some((parcel ) => {
                
                  // Verificar se a data da parcela já passou
                  const parcelDate = convertDate(parcel.dueDate);
                  return parcelDate < currentDate; // Parcelas já vencidas

            })

        )*/

        // Calcular o total de parcelas vencendo no próximo vencimento
        const totalNextDue = card.accounts.reduce((accumulator, account) => {
            const parcelSum = account.parcels
                .filter((parcel) => {
                    const parcelDate = convertDate(parcel.dueDate);
                    return parcelDate >= currentDate && parcelDate <= nextDueDate;
                    // Somente parcelas entre hoje e o próximo vencimento
                })
                .reduce((sum, parcel) => sum + parcel.parcelAmount, 0);
            return accumulator + parcelSum;
        }, 0);

        // Adicionar o total da próxima fatura ao objeto do cartão
        const cardWithTotal = {
            ...card.toObject(),
            totalNextDue, // Adiciona o total da próxima fatura
        };

        res.status(200).json(cardWithTotal);


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

    const isCurrentMonth = currentMonth === "true" || currentMonth === true


    try {

        const card = await Card.findById(idCard)

        if (!card) {
            return res.status(404).json({ error: "card not found." });
        }

        const parcelValue = parseFloat((amount / parcel).toFixed(2))
        const parcels = []

        const currentDate = new Date()
        currentDate.setDate(card.date)// define o dia do vencimento

        const currentMonthOffset = isCurrentMonth ? 0 : 1

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



app.delete('/cards/:id/accounts/:idAccount', async (req, res, next) => {
    try {
        const idCard = req.params.id;
        const idAccount = req.params.idAccount;

        console.log("Card ID:", idCard);
        console.log("Account ID:", idAccount);

        // Encontrar o cartão pelo ID
        const card = await Card.findById(idCard);

        if (!card) {
            return res.status(404).json({ error: "Card not found." });
        }

        // Encontrar o índice da conta no array
        const accountIndex = card.accounts.findIndex(
            (account) => account._id.toString() === idAccount
        );

        if (accountIndex === -1) {
            return res.status(404).json({ error: "Account not found." });
        }

        // Remover a conta do array
        const removedAccount = card.accounts.splice(accountIndex, 1);

        // Salvar as alterações no banco
        await card.save();

        console.log("Account deleted:", removedAccount);
        res.status(200).json({ message: "Account deleted successfully!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ error: "Error deleting account." });
    }
});



app.delete('/cards/:id', async (req, res, next) => {

    try {

        const idCard = req.params.id

        const cardToDelete = await Card.findByIdAndDelete(idCard)

        if (!cardToDelete) {
            return res.status(404).json({ error: 'Card not found' })
        }


        res.status(200).json({ message: 'Card deleted successfully', card: cardToDelete });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting card' });
    }

})


app.listen(PORT, () => {
    console.log('projeto rodando na porta ' + PORT)
})
