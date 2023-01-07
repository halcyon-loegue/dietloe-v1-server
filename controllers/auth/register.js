const pool = require('../../db')
const bcrypt = require('bcrypt')

const checkUser = async (email, username) => {
    try {
        const foundUser = await pool.query("SELECT email FROM users WHERE email = $1 OR username = $2", [email, username])
        if (foundUser?.rowCount && foundUser?.rows[0]) return { status: false, code: 409, message: "Email or username already in use." }
        return { status: true }
    } catch (error) {
        return { status: false, code: 500, message: "Error occurred.", error }
    }
}

const createUser = async (req, hashedPassword) => {
    const { firstName, lastName, email, username, weight, height, preference } = req.body;
    try {
        let newUser;
        if (preference) {
            newUser = await pool.query(
                "INSERT INTO users (id, email, username, firstname, lastname, hashpass, weight, height, preference) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
                [email, username, firstName, lastName, hashedPassword, weight, height, [preference]]
            )
        } else {
            newUser = await pool.query(
                "INSERT INTO users (id, email, username, firstname, lastname, hashpass, weight, height) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [email, username, firstName, lastName, hashedPassword, weight, height]
            )        
        }
        if (newUser?.rowCount && newUser?.rows[0]) return { status: true, code: 201, message: "Registration successful.", id: newUser.rows[0].id }
        return { status: false, code: 500, message: "Error occurred. Please try again later."}
    } catch (error) {
        return { status: false, code: 500, message: "Error occurred. Please try again later.", error }
    }
}

const register = async (req, res) => {
    const { email, username, password } = req.body;

    // check user
    const checkUserResult = await checkUser(email, username);
    if (!checkUserResult.status) return res.status(checkUserResult.code).json(checkUserResult);

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    // create user
    const createUserResult = await createUser(req, hashedPassword)
    return res.status(createUserResult.code).json(createUserResult)
}

module.exports = { register }