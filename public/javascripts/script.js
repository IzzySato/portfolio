'use strict';
import * as Snippet from '../snippets/snippets.js';

const navUl = document.querySelector('#navUl');
const theaterImg = document.querySelector('#theaterImg');
const fashionNote = document.querySelector('#fashionNote');

const processClick = (target) => {

    if(target.matches('#phoneMenu') || target.matches('.navLines')) {
        navUl.classList.toggle('show');
    }
};

window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.snippetCode').forEach(
    async e => { 
        await Snippet.formatHTML(e);
        hljs.highlightBlock(e);
    });
    
    document.addEventListener('click', ({
        target
      }) => processClick(target));
      if (theaterImg) {
        theaterImg.addEventListener('mouseover', () => fashionNote.classList.add('show'));
        theaterImg.addEventListener('mouseout', () => fashionNote.classList.remove('show'));
      }
});