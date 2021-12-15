const express = require('express');
const router = express.Router();

const navLinks = [{link: '/', name: 'PROJECTS'}, 
{link: '/hobby', name: 'HOBBIES'}];

router.get('/', (req, res, next) => {
  res.render('aboutMe', {navLinks});
});

module.exports = router;