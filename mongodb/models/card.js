const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    pinCode: {type:String, match: /\d\d\d\d/, minLength: 4, maxLength: 4,  required: true},
    expDate: {type: Date,}
});

module.exports.model = mongoose.model('card', cardSchema);
module.exports.schema = cardSchema;

