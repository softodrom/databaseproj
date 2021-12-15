const mongoose = require('mongoose');
const currency  = require("./currency")
const card  = require("./card")


const accountSchema = new mongoose.Schema({
    amount: String,
    currency: currency.schema,
    cards: [card.schema]

});

module.exports.schema = accountSchema;
module.exports.model = mongoose.model('account', accountSchema);

