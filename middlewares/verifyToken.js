import jwt from 'jsonwebtoken'
import response from '../utils/response.js'

const verifyToken = (req, res, next) => {
    const authToken = req.headers['authorization']
    const token = authToken && authToken.split(' ')[1]
    // if(!token) return response(401, "Unauthorization", null, "Unauthorization", res)
    if(!token) return response(401, "Unauthorization", null, "Token Expired", res)
    if(token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) return response(403, "Forbidden", null, "Forbidden", res)
            req.email = decoded.email
            next()
        })
    }
}

export default verifyToken