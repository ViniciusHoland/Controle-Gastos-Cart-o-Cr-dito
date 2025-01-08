const sequence = {
  _id: 1,
  get id() {
    return this._id++;
  },
};

const sequenceAccount = {
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

function saveCard(cardToSave, idCard = null) {
  // se não tiver id irá atribuir um novo Id
  if (!idCard) {
    cardToSave.id = sequence.id;
    cardToSave.accounts = [] // iniciliza um array de contas
    cards.push(cardToSave) // adiciona um novo cartao a lista 
  }

  else {
    // tenta atualizar o cartao atraves do id 
    const index = cards.findIndex(card => card.id === idCard)
    if (index !== -1) {
      // vai atualizar o cartão no indice encontrado
      cards[index] = { ...cards[index], ...cardToSave }
    } else {
      throw new Error("Card not found");
    }
  }

  return cardToSave;

}

function getCards() {
  return cards;
}

function deleteCard(idCard) {

  const indexCard = cards.findIndex(card => card.id === parseInt(idCard))

  if (indexCard === -1) {
    throw new Error(`Card with ID ${idc} not found`);
  }

  const cardToDelete = cards.splice(indexCard, 1)[0]

  return cardToDelete

}


function getCardById(id) {
  return cards.find(card => card.id === id) || {}
}

function getAccount(card, idAccount) {
  const IndexAccount = card.accounts.findIndex(account => account.id === idAccount)

  if (IndexAccount === -1) {
    throw new Error(`Account with ID ${idAccount} not found`);
  }

  return card.accounts[IndexAccount]

}


function savedAccountInCard(idCard, account, isCurrent, idAccount = null) {
  const cardToSaveAccount = getCardById(parseInt(idCard))


  if (!cardToSaveAccount) {
    throw new Error(`Card with ID ${idCard} not found`)
  }

  if (!idAccount) {
    const parcelValue = parseFloat((account.amount / account.parcel).toFixed(2))
    const parcels = []

    const currentDate = new Date()
    currentDate.setDate(cardToSaveAccount.date)// define o dia do vencimento

    const currentMonth = isCurrent ? 0 : 1

    for (let i = 0; i < account.parcel; i++) {

      const dueDate = new Date(currentDate) // cria uma nova data com base na data Inicial
      dueDate.setMonth(currentDate.getMonth() + i + currentMonth) // incrementa 1 mes a cada parcela matendo o dia de vencimento

      const formattedDate = `${String(dueDate.getDate()).padStart(2, "0")}/${String(
        dueDate.getMonth() + 1
      ).padStart(2, "0")}/${dueDate.getFullYear()}`;


      parcels.push({
        description: account.description,
        parcel: i + 1,
        amount: parcelValue,
        dueDate: formattedDate // formata a data 
      })
    }

    const newAccount = {
      id: sequenceAccount.id,
      ...account,
      parcels, // adiciona as parcelas
    }

    cardToSaveAccount.accounts.push(newAccount)

  } else {
    // Atualizando uma conta existente
    const accountToUpdate = getAccount(cardToSaveAccount, idAccount); // Pega a conta existente
    const parcelValue = parseFloat((account.amount / account.parcel).toFixed(2)); // Recalcula o valor de cada parcela
    const parcels = [];

    // Recalcular as parcelas, mas mantendo o vencimento original
    for (let i = 0; i < account.parcel; i++) {
      const dueDate = new Date(accountToUpdate.parcels[i].dueDate); // Mantém a data de vencimento original
      const formattedDate = `${String(dueDate.getDate()).padStart(2, "0")}/${String(
        dueDate.getMonth() + 1
      ).padStart(2, "0")}/${dueDate.getFullYear()}`;

      parcels.push({
        description: account.description, // Atualiza a descrição se necessário
        parcel: i + 1,
        amount: parcelValue, // Atualiza o valor da parcela
        dueDate: formattedDate // Mantém a data de vencimento original
      });
    }

    // Atualizando os dados da conta
    accountToUpdate.description = account.description; // Atualiza a descrição da conta
    accountToUpdate.amount = account.amount; // Atualiza o valor total da conta
    accountToUpdate.parcels = parcels; // Atualiza as parcelas
  }

  return account;
}



function deleteAccountToCard(idCard, idAccount) {

  const cardToSaveAccount = getCardById(parseInt(idCard))

  if (!cardToSaveAccount) {
    throw new Error(`Card with ID ${idCard} not found`)
  }

  const accountIndex = cardToSaveAccount.accounts.findIndex(account => account.id === parseInt(idAccount))

  if (accountIndex === -1) {
    throw new Error(`Account with ID ${idAccount} not associated with this card`);
  }

  const removedAccount = cardToSaveAccount.accounts.splice(accountIndex, 1)[0]

  return removedAccount

}




module.exports = { saveCard, getCards, getCardById, savedAccountInCard, deleteAccountToCard, deleteCard };
