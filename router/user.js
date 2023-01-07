const express = require('express');
const { verify } = require('../middleware/verify');
const router = express.Router();
const { get } = require('../controllers/user/get')
const { edit } = require('../controllers/user/edit')
const { upload } = require('../controllers/user/upload')
const { uploadMiddleware } = require('../middleware/uploadMiddleware')

// @route GET /api/user/
// @desc Fetch user details
// @perms Logged in user
router.get('/', verify, get)

// @route PUT /api/user/:id
// @desc Update user details
// @perms Logged in user
router.put('/:id', verify, edit)

// @route PUT /api/user/upload
// @desc Update profile picture
// @perms Logged in user
router.patch('/upload', verify, uploadMiddleware.single("profilePicture"), upload)

module.exports = router;