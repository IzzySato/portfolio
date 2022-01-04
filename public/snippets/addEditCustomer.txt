import * as ProductUtil from './productUtil.js';
import * as Util from './util.js';

//add or edit customer
const addEditCustomer = (
  id,
  customerFirstName,
  customerLastName,
  phone,
  email,
  street,
  city,
  postcode,
  country = 'Canada',
  hottubModel,
  comments = '') => {
  const customer = {
    id,
    customerFirstName,
    customerLastName,
    phone,
    email,
    street,
    city,
    postcode,
    country,
    hottubModel,
    comments
  };

  fetch('/addEditCustomer/addEdit', {
      method: 'POST',
      body: JSON.stringify(customer),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(res => res.json())
    .then(({url}) => {
      Util.insertMessage(messageDiv(), false, 'Saved Customer');
      const btn = document.querySelector('.btnMessage');
      btn.addEventListener('click', () => {
        location.href = url;
      });
    });
};

const messageDiv = () => document.querySelector('#messageAddEditCustomer');

const processClick = (target) => {
  if (target.matches('#newCustomerButton')) {
    const id = document.querySelector('#form').dataset.id;
    const customerFirstName = document.querySelector('#customerFirstName').value;
    const customerLastName = document.querySelector('#customerLastName').value;
    const phone = document.querySelector('#phone').value;
    const email = document.querySelector('#email').value;
    const street = document.querySelector('#street').value;
    const city = document.querySelector('#city').value;
    const postcode = document.querySelector('#postcode').value;
    const country = document.querySelector('#country').value;
    const brand = document.querySelector('#brandSelect').value;
    const model = document.querySelector('#modelSelect').value;
    const comments = document.querySelector('#comments').value;

    const hottubModel = {
      brand,
      model
    };

    

    if((customerLastName === null) || (customerFirstName === null) || (customerFirstName === '') || (customerLastName === '')){
      Util.insertMessage(messageDiv(), true, 'Customer name must not be empty');
    }else{
      addEditCustomer(
        id,
        customerFirstName,
        customerLastName,
        phone,
        email,
        street,
        city,
        postcode,
        country,
        hottubModel,
        comments
      )
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const {dataset: {id}} = document.querySelector('#form');
  const brand = document.querySelector('#brandSelect').dataset.name;
  const model = document.querySelector('#modelSelect').dataset.name;
  const brandSelect = document.querySelector('#brandSelect');
  const modelSelect = document.querySelector('#modelSelect');
  ProductUtil.insertBrandOptionsHTML(id, brandSelect, modelSelect, brand, model);

  document.addEventListener('click', ({
    target
  }) => processClick(target));
});