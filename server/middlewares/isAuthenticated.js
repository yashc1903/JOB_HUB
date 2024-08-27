import jwt from 'jsonwebtoken'

export const requireSignIn = async(req ,res,next) => {
    try {
        const decode = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
        req.user = decode
        next()
    } catch (error) {
        console.log(error)
    }
    
}