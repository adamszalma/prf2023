const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const userModel = mongoose.model('user');

router.route('/register').post(async (req, res, next) => {
    try {
        if (req.body.email && req.body.password) {
            const dbUser = await userModel.findOne({email: req.body.email});
            if (dbUser) return res.status(400).send('Mar regisztraltak ezzel az email cimmel.');
            const user = new userModel({email: req.body.email, password: req.body.password});
            await user.save();
            return res.status(200).send('Felhasznalo sikeresen letrehozva.')
        } else {
            return res.status(400).send('Hibas keres! Email es password kotelezo.')
        }
    } catch (err) {
        return res.status(500).send('hiba tortent.');
    }
})

module.exports = router;