const mongoose = require('mongoose');

const onlineBankingSchema = new mongoose.Schema({
    login: String,
    password: String,
});

module.exports.schema = onlineBankingSchema;
module.exports.model = mongoose.model('onlineBanking', onlineBankingSchema);
