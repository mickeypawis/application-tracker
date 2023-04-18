const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require("moment");

var createdAt = function(){
    var d = new Date();
    var formattedDate = moment(d).format("MM-DD-YYYY, h:mm:ss a");
    return formattedDate;
};
const recapSchema = new Schema({
    body: String,
    createdAt: {
        type: String,
        default: createdAt
      },
    author: {
        type: Schema.Types.ObjectId,
        ref:'Users'
    }
});

module.exports = mongoose.model("Recap", recapSchema);