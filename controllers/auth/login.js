const pool = require('../../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ status: false, message: "Please enter all credentials" });
    
        const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [email])
        if (!findUser.rowCount || !findUser.rows[0]) return res.status(404).json({ status: false, message: "Invalid email or password."})
    
        const foundUser = findUser.rows[0]
        const hashPassword = foundUser.hashpass;
    
        const result = await bcrypt.compare(password, hashPassword);
        if (!result) return res.status(409).json({ status: false, message: "Invalid email or password." })
    
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
    
        const savedRefresh = await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING *    ", [newRefreshToken, foundUser.id])
        if (!savedRefresh.rowCount || !savedRefresh.rows[0]) return res.status(500).json({ status: false, message: "Error occurred. Please try again later." })
    
        if (req.cookies?.jwt) {
            res.clearCookie('jwt', { sameSite: 'none', secure: true, httpOnly: true })
        }
        res.cookie('jwt', newRefreshToken, { maxAge: 1000 * 60 * 60 * 24 * 3, sameSite: 'none', secure: true, httpOnly: true })
        return res.status(201).json({ status: true, message: "Login successful.", accessToken: accessToken })    
    } catch (error) {
        return res.status(500).json({ status: false, message: "Error occurred. Please try again later.", error })
    }
}

module.exports = { login }