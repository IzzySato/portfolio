const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('plantCode', {page: 'plantCode'});
});

module.exports = router;