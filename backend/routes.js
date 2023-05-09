const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const userModel = mongoose.model('user');
const petModel = mongoose.model('pet');
const { randomUUID } = require('crypto');

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

//Pets - get
router.route('/pets').get(async (req, res, next) => {
    try {
        const pets = await petModel.find();
        return res.status(200).send(pets);
    } catch (err) {
        return res.status(500).send('Hiba tortent.');
    }
}).post(async (req, res, next) => {
    //Pets - add
    try {
        if (req.body.petName && req.body.petType) {
            const pet = new petModel({id: randomUUID(), petName: req.body.petName, petType: req.body.petType});
            await pet.save();
            return res.status(200).send('Kisllat sikeresen hozzadva.');
        } else {
            return res.status(400).send('Hibas keres! Type es name kotelezo.');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Hiba tortent.');
    }
});

module.exports = router;