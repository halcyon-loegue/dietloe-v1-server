const pool = require('../../db')

const edit = async (req, res) => {
    if (req.user.id !== req.params.id) return res.status(403).json({ status: false, message: "User not authorized." })
    try {
        const { weight, height, preference } = req.body;
        const editedUser = await pool.query(
            "UPDATE users SET weight = $1, height = $2, preference = $3 WHERE id = $4 RETURNING id, email, firstname, lastname, weight, height, preference, picture, username",
            [weight, height, preference, req.params.id]
        )
        if (editedUser?.rowCount && editedUser?.rows[0]) return res.status(201).json({ status: true, message: "User edited successfully", user: editedUser.rows[0] })
        return res.status(500).json({ status: false, message: "Error occurred in editing user details."})
    } catch (error) {
        console.log("Error occurred in editing user details in /controllers/user/edit.js: ", error)
        return res.status(500).json({ status: false, message: "Error occurred in editing user details.", error })
    }
}

module.exports = { edit }