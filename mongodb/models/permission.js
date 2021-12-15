const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    spendLimit: Number,
    abroadUsage: Number,
});

module.exports.schema = permissionSchema;
module.exports.model = mongoose.model('permission', permissionSchema);
