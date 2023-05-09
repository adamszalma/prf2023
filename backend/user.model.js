const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, lowercase: true},
    password: {type: String, required: true},
}, {collection: 'liveUsers'});

userSchema.pre('save', function(next) {
    const user = this;
    if (user.isModified('password')) {
        bcryptjs.genSalt(10, function(err, salt) {
            if (err) {
                console.log('Hiba a salt generalasa soran.');
                return next(err);
            }
            bcryptjs.hash(user.password, salt, function (error, hash) {
                if (error) {
                    console.log('Hiba a hasheles soran.')
                    return next(error);
                }
                user.password = hash;
                return next();
            })
        })
    } else {
        return next();
    }
});


userSchema.methods.comparePasswords = function(password, next) {
    bcryptjs.compare(password, this.password, function(err, isMatch) {
        next(err, isMatch);
    })
}

mongoose.model('user', userSchema);