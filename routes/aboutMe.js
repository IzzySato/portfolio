const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('aboutMe', {page: 'aboutMe'});
});

module.exports = router;