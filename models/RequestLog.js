const mongoose = require("mongoose");

const requestLogSchema = mongoose.Schema({
    search: String,
    date: Date,
    ip: String
})

module.exports = mongoose.model("RequestLog", requestLogSchema);