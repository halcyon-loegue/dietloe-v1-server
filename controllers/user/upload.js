const pool = require('../../db')

const upload = async (req, res) => {
    console.log('File upload to: ', req.file.path)
    try {
        const updatePicture = await pool.query(
            "UPDATE users SET picture = $1 WHERE id = $2 RETURNING id, email, firstname, lastname, weight, height, preference, picture, username",
            [req.file.path, req.user.id]
        )
        if (updatePicture?.rowCount && updatePicture?.rows[0]) return res.status(201).json({ status: true, message: "Profile picture updated.", user: updatePicture.rows[0] })
        return res.status(500).json({ status: false, message: "Error occurred when saving profile picture to database." })
    } catch (error) {
        console.log(`Error occurred when saving profile picture to db: `, error)
        return res.status(500).json({ status: false, message: "Error occurred when saving profile picture to database.", error })
    }
}

module.exports = { upload }