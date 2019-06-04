const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true}
})
module.exports = mongoose.model('News', newsSchema)
