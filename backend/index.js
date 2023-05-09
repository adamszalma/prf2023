const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose  = require('mongoose');
const passport = require('passport');
const expressSession = require('express-session');
const localStrategy = require('passport-local').Strategy;
const path = require('path');

const app = express();
const port = 3000;
// Change this to the actual url.
const dbUrl = 'mongodb+srv://admin:teszt123@prf-cluster.e4w62n9.mongodb.net/?retryWrites=true'

mongoose.connect(dbUrl);

mongoose.connection.on('connected', () => {
    console.log('db csatlakoztatva');
})

mongoose.connection.on('error', (err) => {
    console.log('db csatlakozas sikertelen', err);
})

require('./user.model');
const userModel = mongoose.model('user');
require('./pet.model');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:4200'
    }
));

passport.use('local', new localStrategy(async function (username, password, done) {
    try {
        const dbUser = await userModel.findOne({username: username});
        if(!dbUser) return done('Nincs ilyen felhasznalonev.', null) 
        dbUser.comparePasswords(password, function(error, isMatch) {
            if (error) return done(error, false);
            if (!isMatch) return done('Hibas jelszo.', false);
            return done(null, dbUser);
        })
    } catch (err) {
        return done('Hiba a lekeres soran.', null)
    }
}));

passport.serializeUser(function (user, done) {
    if(!user) return done('Nincs megadva beleptetheto felhasznalo.', null)
    return done(null, user);
});

passport.deserializeUser(function (user, done) {
    if(!user) return done('Nincs felhasznalo akit kileptethetnenk.', null)
    return done(null, user);
});

app.use(expressSession({secret: 'prf2023', resave: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', require('./routes'));

app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/', (req, res) => res.render('pages/index'))

app.use((req, res, next) => {
    res.status(404).send('A kert eroforras nem talalhato.');
})

app.listen(port, () => {
    console.log('The server is running.');
})
