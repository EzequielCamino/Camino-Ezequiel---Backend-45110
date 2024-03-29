const passport = require('passport');
const local = require('passport-local');
const github = require('passport-github2');
const jwt = require('passport-jwt');
const usersModel = require('../dao/services/mongo/models/user.model.js');
const {createHash, validateHash} = require("../utils/bcrypt.js");
const config = require("./config.js")
const LocalStrategy = local.Strategy;
const GithubStrategy = github.Strategy;
const JwtStrategy = jwt.Strategy;
const cartService = require("../dao/services/mongo/cart.service.js");

function cookieExtractor(req){
    return req?.cookies?.['jwt'];
}

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField: 'email'}, async (req, username, password, done) => {
            const user = req.body;
            try {
                const userExists = await usersModel.findOne({email: username})
                if(userExists){
                    console.log("User already exists");
                    return done(null, false);
                }
                const hash = createHash(user.password);
                const cartID = await cartService.create()
                const response = await usersModel.create({...user, cart: cartID ,password: hash});
                return done(null, response);
            } catch (error) {
                return done(`Error al registrar usuario: ${error}`)
            }
        }
    ));
    
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'}, async (username, password, done) => {
            if(username === "adminCoder@coder.com" && password === "adminCod3r123"){
                const admin = {
                    name: "admin",
                    lastname: "admin",
                    age: 0,
                    email: username,
                    password: createHash(password),
                    role: "admin"
                }
                const adminUser = await usersModel.findOne({email: username}) ?? await usersModel.create(admin);
                return done(null, adminUser);
            }
            try {
                const user = await usersModel.findOne({email: username});
                if (!user || !validateHash(password, user.password)) {
                    return done('wrong mail or password', false);
                }
                await usersModel.findOneAndUpdate({email: username}, {last_connection: new Date()})
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('github', new GithubStrategy({
        clientID: config.githubClientID,
        clientSecret: config.githubClientSecret,
        callbackURL: config.githubCallbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.login;
            const user = await usersModel.findOne({email});
            if(!user) {
                const newUser = {
                    name: profile._json.login,
                    lastname: "none",
                    age: 0,
                    email: profile._json.login,
                    password: "none",
                    cart: {},
                    role: "user"
                }
                const response = await usersModel.create(newUser);
                return done(null, response);
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.JWT_TOKEN,
        ignoreExpiration: false
    },
    (payload, done) => {
        try {
            return done(null, payload);
        } catch (error) {
            done(error, null);
        }
    }))

    passport.serializeUser((user, done) =>{
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) =>{
        const user = await usersModel.findById(id);
        await usersModel.findByIdAndUpdate(id, {last_connection: new Date()});
        done(null, user);
    });
}

module.exports = initializePassport;