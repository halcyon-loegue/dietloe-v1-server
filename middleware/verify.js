const jwt = require('jsonwebtoken')

const verify = async (req, res, next) => {
    if (!req.headers?.authorization) return res.status(401).json({ status: false, message: "User not authenticated" })
    if (!req.headers.authorization.startsWith('Bearer')) return res.status(400).json({ status: false, message: "Bad token." })
    let token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(400).json({ status: false, message: "Bad token. No token provided in headers." })

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
        if (!decoded) return res.status(401).json({ status: false, message: "Invalid token provided." })
        req.user = {
            id: decoded.id,
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName
        }
        return next()
    } catch (error) {
        console.log(`Error in verifying JWT middleware: `, error)
        return res.status(500).json({ status: false, message: "Error occurred. Please try again later." })
    }
}

module.exports = { verify }