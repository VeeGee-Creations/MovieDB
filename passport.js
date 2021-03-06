const passport = require('passport')
    LocalStrategy = require('passport-local').Strategy,
    models = require('./models.js'),
    passportJWT = require('passport-jwt');
    // mongoose = require('mongoose');

const Users = models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

// const Movies = models.Movie;
// const Genres = models.Genre;
// const Directors = models.Director;

passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password',
}, (username, password, callback) => {
    console.log(`${username} ${password}`);
    Users.findOne({Username: username}, (err, user) => {
        if(err) {
            console.log(err);
            return callback(err);
        }

        if(!user) {
            console.log('Incorrect username');
            return callback(null, false, {message: 'Incorrect username.'});
        }

        if(!user.validatePassword(password)) {
            console.log('Incorrect password');
            return callback(null, false, {message: 'Incorrect Password.'});
        }

        console.log('finished');
        return callback(null, user);
    })
    // .populate({
    //     path: 'Favorites', model: Movies,
    //     populate: [
    //         {path: 'Directors', model: Directors},
    //         {path: 'Genres', model: Genres}
    //     ]
    // });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => callback(null, user))
    .catch((err) => callback(err));
}));