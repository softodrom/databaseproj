const mongoose = require('mongoose')
const employee = require('./employee')


const bankSchema = new mongoose.Schema({
    address: {type: String, required: true},
    phone: String,
    employee: [employee.schema]
});

module.exports.schema = bankSchema;
module.exports.model = mongoose.model('bank', bankSchema);
