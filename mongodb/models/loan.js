const mongoose = require('mongoose');
const currency  = require("./currency")

const loanSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    amount: Number,
    interestRate: Number,
    currency: currency.schema
});

module.exports.model = mongoose.model('loan', loanSchema);
module.exports.schema = loanSchema;

