const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({

    description: {type: String, required: true },
    amount: { type: Number, required: true},
    parcel: {type: Number, required: true},
    currentMonth: {type: Boolean, required: true, default: false},
    parcels: [{
        parcelAmount: {type, Number, required: true},
        dueDate: {type: Date, required: true},
        numParcel: {type: Number, required: true}
    }]

})

const CardSchema = new mongoose.Schema({

    title: {type: String, required: true},
    date: {type: Number, required: true},
    accounts: [AccountSchema]


})

const Card = mongoose.model('Card', CardSchema)

module.exports = Card; 