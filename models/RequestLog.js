const mongoose = require("mongoose");

const requestLogSchema = mongoose.Schema({
    search: String,
    date: Date,
    ip: String,
    responseFrom: String
})

module.exports = mongoose.model("RequestLog", requestLogSchema);