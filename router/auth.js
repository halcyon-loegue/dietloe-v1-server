const express = require('express');
const { login } = require('../controllers/auth/login');
const { logout } = require('../controllers/auth/logout');
const { refresh } = require('../controllers/auth/refresh');
const { register } = require('../controllers/auth/register');
const { verify } = require('../middleware/verify');
const router = express.Router();

// @route POST /api/auth/register
// @desc Create account
// @perms All
router.post('/register', register)

// @route POST /api/auth/login
// @desc Log in to account
// @perms All
router.post('/', login)

// @route POST /api/auth/logout
// @desc Log out from account
// @perms Users only
router.post('/:id', verify, logout)

// @route GET /api/auth/refresh
// @desc Get new refresh token
// @perms Users only
router.get('/refresh', refresh)

module.exports = router;