const pool = require('../../db')
const jwt = require('jsonwebtoken')

const refresh = async (req, res) => {
    try {
        if (!req.cookies?.jwt) return res.status(401).json({ status: false, message: "User not authenticated." })
        const currentToken = req.cookies.jwt
        res.clearCookie('jwt', { sameSite: 'none', secure: true, httpOnly: true })

        const decoded = jwt.verify(currentToken, process.env.REFRESH_SECRET)
        if (!decoded) return res.status(400).json({ status: false, message: "Refresh token expired." })

        const findUser = await pool.query("SELECT * FROM users WHERE refresh_token = $1 AND id = $2", [currentToken, decoded.id])
        if (!findUser?.rowCount || !findUser?.rows[0]) return res.status(401).json({ status: false, message: "User not authenticated. Invalid token."})
        
        const foundUser = findUser.rows[0]

        const accessToken = jwt.sign(
            {
                id: foundUser.id,
                email: foundUser.email,
                firstName: foundUser.firstname,
                lastName: foundUser.lastname
            },
            process.env.ACCESS_SECRET,
            {
                expiresIn: "1d"
            }
        )

        const newRefreshToken = jwt.sign(
            {
                id: foundUser.id
            },
            process.env.REFRESH_SECRET,
            {
                expiresIn: "3d"
            }
        )

        const updateToken = await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING *", [newRefreshToken, decoded.id])
        if (!updateToken?.rowCount || !updateToken?.rows[0]) return res.status(500).json({ status: false, message: "Error occured when saving new refresh token to database." })

        res.cookie('jwt', newRefreshToken, { maxAge: 1000 * 60 * 60 * 24 * 3, sameSite: 'none', secure: true, httpOnly: true })
        return res.status(200).json({ status: true, message: "Refresh successful.", accessToken: accessToken })
    } catch (error) {
        return res.status(500).json({ status: false, message: "Error occurred. Please try again later.", error })
    }
}   
module.exports = { refresh }