const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/src/images')
    },
    filename: (req, file, cb) => {
        cb(null, req.user.id + Date.now() + path.extname(file.originalname))
    }
})

const uploadMiddleware = multer({ storage: storage })

module.exports = { uploadMiddleware }