const pool = require('../../db')

const logout = async (req, res) => {
    const paramsId = req.params.id
    const id = req.user.id

    try {
        if (paramsId !== id) return res.status(403).json({ status: false, message: "User not authorized." })
        
        const logoutAttempt = await pool.query("UPDATE users SET refresh_token = null WHERE id = $1 RETURNING *", [id])
        
        if (req.cookies?.jwt) {
            res.clearCookie('jwt', { sameSite: 'none', secure: true, httpOnly: true })
        }
        return res.status(200).json({ status: true, message: "User logged out." })
    } catch (error) {
        return res.status(500).json({ status: false, message: "Error occurred when logging out.", error })
    }

}

module.exports = { logout }