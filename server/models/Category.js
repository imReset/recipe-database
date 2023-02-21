const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This is a required field'
    },
    image: {
        type:  String,
        required: 'This is a required field'
    },
});

module.exports = mongoose.model('Category',  categorySchema)