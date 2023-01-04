const pool = require('../../db')
const bcrypt = require('bcrypt')

const checkUser = async (email) => {
    try {
        const foundUser = await pool.query("SELECT email FROM users WHERE email = $1", [email])
        if (foundUser?.rowCount && foundUser?.rows[0]) return { status: false, code: 409, message: "Email already in use. Please try another email." }
        return { status: true }
    } catch (error) {
        return { status: false, code: 500, message: "Error occurred.", error }
    }
}

const createUser = async (req, hashedPassword) => {
    const { firstName, lastName, email, weight, height, preference } = req.body;
    try {
        let newUser;
        if (preference) {
            newUser = await pool.query(
                "INSERT INTO users (id, email, firstname, lastname, hashpass, weight, height, preference) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [email, firstName, lastName, hashedPassword, weight, height, preference]
            )
        } else {
            newUser = await pool.query(
                "INSERT INTO users (id, email, firstname, lastname, hashpass, weight, height) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6) RETURNING *",
                [email, firstName, lastName, hashedPassword, weight, height]
            )        
        }
        if (newUser?.rowCount && newUser?.rows[0]) return { status: true, code: 201, message: "Registration successful.", id: newUser.rows[0].id }
        return { status: false, code: 500, message: "Error occurred. Please try again later."}
    } catch (error) {
        return { status: false, code: 500, message: "Error occurred. Please try again later.", error }
    }
}

const register = async (req, res) => {
    const { email, password } = req.body;

    // check user
    const checkUserResult = await checkUser(email);
    if (!checkUserResult.status) return res.status(checkUserResult.code).json(checkUserResult);

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    // create user
    const createUserResult = await createUser(req, hashedPassword)
    return res.status(createUserResult.code).json(createUserResult)
}

module.exports = { register }