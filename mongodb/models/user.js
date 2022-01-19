
const mongoose = require('mongoose');
const account = require('./account')
const bank = require('./bank')
const loan = require('./loan')


const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    sex: {type: String, required: true},
    phone: {type: String, required: true},
    accounts: {type: [account.schema], required: true},
    bank: {type: mongoose.Schema.Types.ObjectId, ref: "bank", required: true},
    loan: [loan.schema]

});

module.exports.schema = userSchema;
module.exports.model = mongoose.model('user', userSchema);
