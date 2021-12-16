import * as Nav from './nav.js';

const navUl = document.querySelector('#navUl');
const theaterImg = document.querySelector('#theaterImg');
const fashionNote = document.querySelector('#fashionNote');

const processClick = (target) => {

    if(target.matches('#phoneMenu') || target.matches('.navLines')) {
        navUl.classList.toggle('show');
    }
};

window.addEventListener('DOMContentLoaded', (event) => {
    document.addEventListener('click', ({
        target
      }) => processClick(target));
      theaterImg.addEventListener('mouseover', () => fashionNote.classList.add('show'));
      theaterImg.addEventListener('mouseout', () => fashionNote.classList.remove('show'));
});