const express = require('express');
const { sign_up_get, sign_up_post } = require('../controllers/auth-controller');
const router = express.Router();

router.route('/').get(sign_up_get).post(sign_up_post);

module.exports = router;
