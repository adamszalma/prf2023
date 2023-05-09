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

//Logout
router.route('/logout').post((req, res, next) => {
    if (req.isAuthenticated()) {
        req.logOut((err) => {
            if (err) return res.status(400).send('Sikertelen kijelentkezes.');
            return res.status(200).send('Kijelentkezes sikeres.');
        });
    } else {
        return res.status(400).send('Nem is volt bejelentkezve felhasznalo.');
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
}).put(async (req, res, next) => {
    try {
        if (req.body.id && req.body.petName && req.body.petType) {
            const dbPet = await petModel.findOne({id: req.body.id});
            if (dbPet) {
                dbPet.petName = req.body.petName;
                dbPet.petType = req.body.petType;
                await dbPet.save();

                return res.status(200).send('Sikeres frissites tortent.');
            } else {
                return res.status(400).send('Nincs ilyen id.');
            }
        } else {
            return res.status(400).send('Hibas keres! Type, name es id kotelezo.');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Hiba tortent.');
    }
}).delete(async (req, res, next) => {
    try {
        if (req.body.id) {
            const dbPet = await petModel.findOne({id: req.body.id});
            if (dbPet) {
                await dbPet.deleteOne();

                return res.status(200).send('Sikeres torles.');
            } else {
                return res.status(400).send('Nincs ilyen id.');
            }
        } else {
            return res.status(400).send('Hibas keres! Id kotelezo.');
        }
    } catch (err) {
        return res.status(500).send('Hiba tortent.');
    }
});

module.exports = router;