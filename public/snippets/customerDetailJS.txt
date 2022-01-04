import * as WorkHistoryUtil from './workHistoryUtil.js';
const workData = {};

const getWorkData = (customerId) => new Promise ((res, rej) => {
  fetch(`/customerDetail/workHistory/${customerId}`)
  .then(res => res.json())
  .then(json => {
    workData.histories = json;
    res();
  });
});


const workTemplate = ({date, service}) => {
  const newDate = new Date(date);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

  const html = `
<div class="serviceDiv">
  <h3 class="cusDetailHeader">Date:</h3>
  <p class="workP">${newDate.getDate()} / ${monthNames[newDate.getMonth()]}/ ${newDate.getFullYear()}</p>
  <h3 class="cusDetailHeader">service:</h3>
  <p class="workP">${service}</p>
</div>
`;
return html;
};

const workDataToHTML = (insertDiv) => {
  const html = workData.histories.map(work => workTemplate(work)).join('');
  insertDiv.innerHTML = html;
};

const processClick = (target) => {
  const {dataset: {id}} = target;
  if(target.matches('.editCustomer')) location.href=`/addEditCustomer/${id}`;
  if(target.matches('.addHistoryBtn')) WorkHistoryUtil.openCloseWorkFormDiv();
  if(target.matches('.submitNewWork')){
    const date = document.querySelector('#detailDateInput').value;
    const service = document.querySelector('#detailWorkInput').value;
    WorkHistoryUtil.addWork( id, date, service);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const {dataset: {id}} = document.querySelector('#customerID');
  getWorkData(id).then(() => {
    const insertDiv = document.querySelector('#workDataDiv');
    workDataToHTML(insertDiv);
    document.addEventListener('click', ({target}) => processClick(target));
  });
});