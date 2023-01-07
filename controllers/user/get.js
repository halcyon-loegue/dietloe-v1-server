const pool = require('../../db')

const get = async (req, res) => {
    try {
        const id = req.user.id
        const foundUser = await pool.query(
            "SELECT id, email, firstname, lastname, weight, height, preference, picture, username FROM users WHERE id = $1",
            [id]
        )
    
        if (foundUser?.rowCount && foundUser?.rows[0]) return res.status(200).json({ status: true, user: foundUser.rows[0] })
        return res.status(404).json({ status: false, message: "Failed to fetch user details. Error: Token ID does not match any existing User IDs."})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Failed to fetch user details. Please try again later."})
    }
}

module.exports = { get }