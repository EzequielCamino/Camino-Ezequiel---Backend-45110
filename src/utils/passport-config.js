const passport = require('passport');
const local = require('passport-local');
const github = require('passport-github2');
const usersModel = require('../dao/models/user.model.js');
const {createHash, validateHash} = require("./bcrypt.js");
const { githubClientID, githubClientSecret, githubCallbackURL } = require('../../data.js')

const LocalStrategy = local.Strategy;
const GithubStrategy = github.Strategy;

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
                const response = await usersModel.create({...user, password: hash});
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
                    password: createHash(password)
                }
                const adminUser = await usersModel.findOne({email: username}) ?? await usersModel.create(admin);
                return done(null, adminUser);
            }
            try {
                const user = await usersModel.findOne({email: username});
                if (!user || !validateHash(password, user.password)) {
                    return done('wrong mail or password', false);
                }
                /* req.session.role = "usuario" */
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('github', new GithubStrategy({
        clientID: githubClientID,
        clientSecret: githubClientSecret,
        callbackURL: githubCallbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email;
            const user = usersModel.findOne({email});
            if(!user) {
                const newUser = {
                    name: profile._json.name,
                    lastname: '',
                    age: 0,
                    email: profile._json.email,
                    password: ''
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

    passport.serializeUser((user, done) =>{
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) =>{
        const user = await usersModel.findById(id);
        done(null, user);
    });
}

module.exports = initializePassport;