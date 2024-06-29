const express = require('express');
const { membership_get, membership_post } = require('../controllers/auth-controller');
const router = express.Router();

// GET home page
router.route('/').get(membership_get).post(membership_post);

module.exports = router;
