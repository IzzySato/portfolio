const login = (username, password) => {
  const user = {
    username,
    password
  };

  fetch('/', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(res => res.json())
    .then(({
      url
    }) => location.href = url);
};

document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.querySelector('#loginButton');
  
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      const username = document.querySelector('#username').value;
      const password = document.querySelector('#password').value;
      Login.login(username, password);
    });
  };
});