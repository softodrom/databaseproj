const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    name: String,
    rateToDKK: Number,
});

module.exports.model = mongoose.model('currency', currencySchema);
module.exports.schema = currencySchema;

