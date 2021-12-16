const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('hobby', {page: 'hobby'});
});

module.exports = router;