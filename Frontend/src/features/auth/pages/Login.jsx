import React from 'react'
import "../style/login.scss"
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'

const Login = () => {
  return (
    <main className="login-page">
      <div className="form-container">
        <h2>Login</h2>
        <form>
          <FormGroup label="Email" placeholder="Enter your email" />
          <FormGroup label="Password" placeholder="Enter your password" />
          <button className="button" type="submit">Login</button>
        </form>
        <p className="register-link">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </main>
  )
}

export default Login
