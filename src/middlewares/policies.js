export const handlePolicies = policies => (req,res,next) => {
    const user = req.session.user

    if(policies.includes('PUBLIC')) {
        return next()
    }
    if(policies.includes('PRIVATE')) {
        if(!user) {
            return res.status(403).send('Not authorized')
        } 
        else {
            return next()
        }
    }
    if(policies.includes('ONLY_USERS')) {
        if(!user || user.role == 'admin') {
            return res.status(403).send('Not authorized')
        } 
        else {
            return next()
        }
    }
    if(policies.includes('PREMIUM')) {
        if(!user) {
            return res.status(403).send('Not authorized')
        } 
        else if (user.role == 'premium')  {
            return next()
        } else {
            return res.status(403).send('Not authorized')
        }
    }
    if(policies.includes('ADMIN')) {
        if(!user) {
            return res.status(403).send('Not authorized')
        } 
        else if (user.role == 'admin')  {
            return next()
        } else {
            return res.status(403).send('Not authorized')
        }
    }
}