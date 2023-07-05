import passport from 'passport'
import local from 'passport-local'
import userModel from './../dao/persistence/mongodb/models/user-model.js'
import cartModel from './../dao/persistence/mongodb/models/carts-model.js'
import { createHash, validatePassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import { config } from './config.js'

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, 
        async (req, username, password, done) =>{
            const { first_name, last_name, email, age } = req.body
            try {
                let user = await userModel.findOne({ email: username })
                if(user){
                    return done(null, false)
                }
                
                let newCart = {}
                newCart = await cartModel.create(newCart)

                let role = 'user'
                password == config.auth.pass && email == config.auth.email ? role = 'admin' : role = 'user'
                
                const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        cart: newCart,
                        role,
                }

                let result = await userModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done(`Error getting user: ${ error }`)
            }
        }
    ))

    passport.serializeUser((user,done) => {
        done(null, user._id)
    })

    passport.deserializeUser( async (id , done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
           const user = await userModel.findOne({ email: username })
            if(!user){
                return done(null, false)
            }
            if(!validatePassword(password, user)) {
                return done (null, false)
            }
            return done(null, user)

        } catch (error) {
            return done(`Error trying to login: ${ error }`)
            
        }

    }))

    passport.use('github', new GitHubStrategy({
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL,
        scope: ["user:email"],

    }, async (accesToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile.emails[0].value })

            if(!user){
                let newCart = {}
                newCart = await cartModel.create(newCart)

                const newUser = {
                        first_name: profile.displayName,
                        last_name: null,
                        email: profile.emails[0].value,
                        age: null,
                        password: '',
                        cart: newCart,
                        role: 'user'
                }
                const result = await userModel.create(newUser);
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(null, error)
        }
    }))
}
export default initializePassport;