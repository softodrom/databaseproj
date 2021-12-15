const mongoose = require('mongoose');

const senderSchema = new mongoose.Schema({
    IBAN: String,
    SWIFT: String,
});

module.exports.schema = senderSchema;
module.exports.model = mongoose.model('sender', senderSchema);
