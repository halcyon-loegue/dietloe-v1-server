const pool = require('../../db')

const del = async (req, res) => {
    if (req.user.id !== req.params.id) return res.status(403).json({ status: false, message: "User not authorized" })
    try {
        const deletedUser = await pool.query("DELETE FROM users WHERE id = $1", [req.params.id])
        return res.status(200).json({ status: true, message: "User deleted successfully" })
    } catch (error) {
        console.log("Error occurred in trying to delete user", error)
        return res.status(500).json({ status: false, message: "Error occurred in trying to delete user", error })
    }
}

module.exports = { del }