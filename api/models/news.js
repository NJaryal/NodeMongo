const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
   author: {
       type: String, 
       required: true
    },
    Date: { 
        type: Date, 
        default: Date.now 
    }
})
module.exports = mongoose.model('News', newsSchema)
