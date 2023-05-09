const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const userModel = mongoose.model('user');

// Register
router.route('/register').post(async (req, res, next) => {
    try {
        if (req.body.username && req.body.password) {
            const dbUser = await userModel.findOne({username: req.body.username});
            if (dbUser) return res.status(400).send('Mar regisztraltak ezzel a felhasznalonevvel.');
            const user = new userModel({username: req.body.username, password: req.body.password});
            await user.save();
            return res.status(200).send('Felhasznalo sikeresen letrehozva.');
        } else {
            return res.status(400).send('Hibas keres! Username es password kotelezo.');
        }
    } catch (err) {
        return res.status(500).send('Hiba tortent.');
    }
});

//Login
router.route('/login').post((req, res, next) => {
    console.log(req.body);
    try {
        if (req.body.username && req.body.password) {
            passport.authenticate('local', function(error, user) {
                if (error) return res.status(500).send(error);
                req.logIn(user, function(err) {
                    if (err) return res.status(500).send(err);
                    return res.status(200).send('Bejelentkezes sikeres.')
                });
            })(req, res);
        } else {
            return res.status(400).send('Hibas keres! Username es password kotelezo.');
        }
    } catch (err) {
        return res.status(500).send('Hiba tortent.');
    }
});

module.exports = router;