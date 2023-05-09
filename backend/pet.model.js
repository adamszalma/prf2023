const mongoose = require('mongoose');

var petSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true, lowercase: true},
    petName: {type: String, required: true},
    petType: {type: String, required: true},
}, {collection: 'pets'});

mongoose.model('pet', petSchema);