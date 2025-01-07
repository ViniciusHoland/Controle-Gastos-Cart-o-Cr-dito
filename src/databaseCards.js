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
    accounts: [
      {
        description: "Ponto Certo",
        amount: 500.0,
        parcel: 5,
      },
    ],
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

function savedAccountInCard(idCard, account) {
  const cardToSaveAccount = getCards().find((cartao) => cartao.id === idCard);

  cardToSaveAccount.push(account);

  return account;
}

module.exports = { saveCard, getCards, getCardById, savedAccountInCard };
