const express = require('express');
const router = express.Router();

const navLinks = [{link: '/aboutMe', name: 'ABOUT ME'}, 
{link: '/hobby', name: 'HOBBIES'}];

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {navLinks});
});

module.exports = router;
