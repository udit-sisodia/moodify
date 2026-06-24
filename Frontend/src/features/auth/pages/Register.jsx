import React from 'react'
import "../style/register.scss"
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'

const Register = () => {
  return (
    <main className="register-page">
      <div className="form-container">
        <h2>Register</h2>
        <form>
          <FormGroup label="Username" placeholder="Enter your username" />
          <FormGroup label="Email" placeholder="Enter your email" />
          <FormGroup label="Password" placeholder="Enter your password" />
          <button className="button" type="submit">Register</button>
        </form>
        <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </main>
  )
}

export default Register
