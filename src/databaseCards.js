const sequence = {
    _id: 1,
    get id() {
        return this._id++
    }
}


const cards = {}

function saveCard(cardToSave){

    // se não tiver id irá atribuir um novo Id
    if(!cardToSave.id){
        cardToSave.id = sequence.id
    }

    // pega o id do objeto e coloca o cartão 
    cards[cardToSave.id] = cardToSave


    return cardToSave
}


function getCards(){

    return Object.values(cards)


}

module.exports = {saveCard,getCards}