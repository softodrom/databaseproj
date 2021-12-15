const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: String,
    surName: String,
    email: String,
    phone: String
});

module.exports.model = mongoose.model('employee', employeeSchema);
module.exports.schema = employeeSchema;

