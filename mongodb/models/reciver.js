const mongoose = require('mongoose');

const reciverSchema = new mongoose.Schema({
    IBAN: String,
    SWIFT: String,
});

module.exports.schema = reciverSchema;
module.exports.model = mongoose.model('reciver', reciverSchema);
