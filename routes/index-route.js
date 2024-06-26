const express = require('express');
const { index_get, index_post } = require('../controllers/index-controller');
const router = express.Router();

// GET home page
router.route('/').get(index_get).post(index_post);

module.exports = router;
