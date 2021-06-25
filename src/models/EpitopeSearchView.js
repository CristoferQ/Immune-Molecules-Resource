"use strict"
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var EpitopeSearchView = Schema({
    id_sequence: String,
    Length: Number,
    antigens: Array
});
module.exports = mongoose.model("EpitopeSearchView", EpitopeSearchView, "EpitopeSearchView");