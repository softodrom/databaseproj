const mongoose = require('mongoose');

const bank_suppliesSchema = new mongoose.Schema({
    IBAN: String,
    SWIFT: String,
});

module.exports.model = mongoose.model('bank_supplies', bank_suppliesSchema);
module.exports.schema = bank_suppliesSchema;

