const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Recap = require('./recap')

const ApplicationSchema = new Schema({
    companyName:String,
    submittedDate: String,
    status:String,
    // feedBack:String,
    recaps:[
        {
            type: Schema.Types.ObjectId,
            ref:'Recap'
        }
    ]
    
})

module.exports = mongoose.model('Application', ApplicationSchema);