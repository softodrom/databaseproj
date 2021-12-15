const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    pinCode: {type:Number, max:9999},
    expDate: Date,
});

module.exports.model = mongoose.model('card', cardSchema);
module.exports.schema = cardSchema;

