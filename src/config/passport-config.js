import passport from 'passport'
import local from 'passport-local'
import userModel from './../dao/mongodb/models/user-model.js'
import { createHash, validatePassword } from './../utils.js'
import GitHubStrategy from 'passport-github2'

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

                const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password)
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
        clientID:'Iv1.a00cc378b1104f5e',
        clientSecret:'505629c16f631cc685b06311fa09e3088b2d8a27',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'

    }, async (accesToken, refreshToken, profile, done) => {
        try {
/*             console.log(profile) */
            let user = await userModel.findOne({ first_name: profile._json.login })
            if(!user){

                const newUser = {
                        first_name: profile._json.login,
                        last_name: profile.provider,
                        email: profile._json.email,
                        age: null,
                        password: ''
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