const express = require('express');
const router = express.Router();

const navLinks = [{link: '/', name: 'PROJECTS'}, 
{link: '/aboutMe', name: 'ABOUT ME'}];

router.get('/', (req, res, next) => {
  res.render('hobby', {navLinks});
});

module.exports = router;