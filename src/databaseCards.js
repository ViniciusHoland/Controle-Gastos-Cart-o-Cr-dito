const sequence = {
  _id: 1,
  get id() {
    return this._id++;
  },
};

const cards = [
  {
    id: sequence.id,
    title: "Caixa",
    date: 5,
    accounts: [],
  },
];

function saveCard(cardToSave) {
  // se não tiver id irá atribuir um novo Id
  if (!cardToSave.id) {
    cardToSave.id = sequence.id;
    cardToSave.accounts = [] // iniciliza um array de contas
    cards.push(cardToSave) // adiciona um novo cartao a lista 
  }

  else {
    // tenta atualizar o cartao atraves do id 
    const index = cards.findIndex(card => card.id = cardToSave.id)
    if(index !== -1){
        cards[index] = cardToSave
    }
  }

  return cardToSave;

}

function getCards() {
  return cards;
}



function getCardById(id) {
  return cards.find(card => card.id === id) || {}
}




function savedAccountInCard(idCard, account, isCurrent) {
  const cardToSaveAccount = getCardById(parseInt(idCard))

  if(!cardToSaveAccount){
    throw new Error(`Card with ID ${idCard} not found`)
  }

  const parcelValue = parseFloat((account.amount / account.parcel).toFixed(2))
  const parcels = []

  const currentDate = new Date()
  currentDate.setDate(cardToSaveAccount.date)// define o dia do vencimento

  const currentMonth = isCurrent ? 0 : 1

  for(let i=0; i< account.parcel;i++){

    const dueDate = new Date(currentDate) // cria uma nova data com base na data Inicial
    dueDate.setMonth(currentDate.getMonth() + i+currentMonth) // incrementa 1 mes a cada parcela matendo o dia de vencimento

    const formattedDate = `${String(dueDate.getDate()).padStart(2, "0")}/${String(
      dueDate.getMonth() + 1
    ).padStart(2, "0")}/${dueDate.getFullYear()}`;


    parcels.push({
      description: account.description,
      parcel: i+1,
      amount: parcelValue,
      dueDate: formattedDate // formata a data 
    })
  }

  const newAccount = {
    ...account,
    parcels, // adiciona as parcelas
  }

  cardToSaveAccount.accounts.push(newAccount)

  return account;
}

function addAccountToCard(idCard, account){



}




module.exports = { saveCard, getCards, getCardById, savedAccountInCard };
