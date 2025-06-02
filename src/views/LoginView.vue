<template>
  <div class="wrapper">
    <div class="login-container">
      <div class="login-form">
        <h3>Selamat Datang</h3>
        <h2>Perpustakaan Wikrama Pedia</h2>
        <form @submit.prevent="handleLogin">
          <div>
            <label for="email">Email</label>
            <input id="email" type="email" v-model="email" autocomplete="off" required />
          </div>
          <div>
            <label for="password">Password</label>
            <input id="password" type="password" v-model="password" autocomplete="off" required />
          </div>
          <button type="submit">LOGIN</button>
        </form>
      </div>
      <div class="login-illustration">
        <img src="@/assets/login-illustration.png" alt="Login Illustration" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      if (!this.email || !this.password) {
        alert('Email dan password harus diisi!')
        return
      }

      axios.post('http://45.64.100.26:88/perpus-api/public/api/login', {
        email: this.email,
        password: this.password
      }, {
        headers: {
          Accept: 'application/json'
        }
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('access_token', response.data.token)
          this.$router.push('/dashboard')
        } else {
          alert('Login gagal, coba lagi.')
        }
      })
      .catch(error => {
        if (error.response && error.response.data) {
          alert('Login gagal: ' + JSON.stringify(error.response.data));
        } else {
          alert('Login gagal! Periksa email dan password.');
        }
      })
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0fdf4;
  overflow: hidden;
}

.login-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.login-form {
  flex: 1;
  padding: 4rem;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-form h3 {
  font-size: 1.5rem;
  color: #6b7280;
  margin-bottom: 0.2rem;
}

.login-form h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.login-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.login-form input {
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.login-form button {
  width: 100%;
  padding: 0.7rem;
  border: none;
  border-radius: 6px;
  background-color: #a7f3d0;
  color: #065f46;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}

.login-form button:hover {
  background-color: #6ee7b7;
}

.login-illustration {
  flex: 1;
  background-color: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-illustration img {
  max-width: 90%;
  height: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-illustration {
    display: none;
  }
}
</style>
