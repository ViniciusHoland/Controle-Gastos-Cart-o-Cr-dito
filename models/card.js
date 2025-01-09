const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
   
    parcels: [{
        description: {type: String, required: true },
        parcelAmount: {type: Number, required: true},
        dueDate: {type: String, required: true},
        parcel: {type: Number, required: true}
    }]

})

const CardSchema = new mongoose.Schema({

    title: {type: String, required: true},
    date: {type: Number, required: true},
    accounts: [AccountSchema]


})

const Card = mongoose.model('Card', CardSchema)

module.exports = Card; 