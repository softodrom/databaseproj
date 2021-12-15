const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    rate: Number,
    interestType: String,
});

module.exports.model = mongoose.model('interest', interestSchema);
module.exports.schema = interestSchema;

