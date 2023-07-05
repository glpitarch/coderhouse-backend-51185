export const authSession = (req,res,next) => {
    const authHeader = req.session.user
    if(!authHeader){
        return res.status(401).send({
            status: "error",
            error: "Unauthorized"
        })
    }
    next() 
}