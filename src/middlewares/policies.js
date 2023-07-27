export const handlePolicies = policies => (req, res, next) => {
    const user = req.session.user

    if(policies.includes('PUBLIC')) {
        return next()
    }
    if(!user) {
        return res.status(403).send('You must authenticate first to access this section')
    }
    if(policies.includes('PRIVATE')) {
        return next()
    }
    if(policies.includes('ONLY_USERS')) {
        if(user.role == 'admin') {
            return res.status(403).send('Not authorized')
        } 
        else {
            return next()
        }
    }
    if(policies.includes('PREMIUM')) {
        if (user.role == 'premium')  {
            return next()
        }
    }
    if(policies.includes('ADMIN')) {
        if (user.role == 'admin')  {
            return next()
        }
    }
    return res.status(403).send('Not authorized')
}