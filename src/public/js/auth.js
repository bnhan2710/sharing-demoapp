const btnLogin = document.querySelector('#btn_login');
const btnRegister = document.querySelector('#btn_register');
const loginUsername = document.querySelector('#login-username');
const loginPassword = document.querySelector('#login-password');
const registerUsername = document.querySelector('#register-username');
const registerEmail = document.querySelector('#register-email');
const registerPassword = document.querySelector('#register-password');

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();
  const obj = { username, password };

  console.log(obj);
  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
    .then(res => res.json())
    .then(data => {
      console.log('Data:::', data);
      if (data.statusCode === 200) {
        const accessToken = data.message.accessToken;
        sessionStorage.setItem('token', accessToken);
        window.location.href = '/chat';
      } else {
        console.log(data.message);
        alert('Invalid username or password');
      }
    })
    .catch(err => console.error('Error:', err));

  loginUsername.value = '';
  loginPassword.value = '';
});

btnRegister.addEventListener('click', (e) => {
  e.preventDefault();
  const username = registerUsername.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();
  const obj = { username, email, password };

  fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
    .then(res => res.json())
    .then(data => {
      if (data.statusCode === 200) {
        alert('User registered successfully');
      } else {
        alert(data.message);
      }
    })
    .catch(err => console.error('Error:', err));

  registerUsername.value = '';
  registerEmail.value = '';
  registerPassword.value = '';
});
