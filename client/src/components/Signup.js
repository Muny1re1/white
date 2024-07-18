import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';  // Import Yup for validation
import './Login.css';  // Ensure the correct CSS file is imported

function SignUp() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: (values, { setSubmitting, setErrors }) => {
      fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
        },
        credentials: 'include',  // Include credentials in the request
        body: JSON.stringify(values),
      })
        .then(response => {
          setSubmitting(false);
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to sign up');
          }
        })
        .then(data => {
          // Handle successful registration (e.g., redirect or show a success message)
          console.log('Success:', data);
          navigate('/mainpage')
        })
        .catch(error => {
          setErrors({ submit: error.message });
        });
    },
  });

  return (
    <div className="signup">
      <div className="btn btn-back">
        <Link to="/">
          <i className="fa-solid fa-arrow-left-long"></i>
        </Link>
      </div>
      <div className="form-container starter">
        <form onSubmit={formik.handleSubmit}>
          <h1>Join TeenSpace</h1>
          <h2 className="emoji">😊</h2>
          <h3>Create your TeenSpace account</h3>
          <p>Let's get you started on your journey</p>
          <div className="form-group">
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="form-group">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div className="form-group">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className="form-group">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className="btnn">
            <button type="submit" className="login-btn">
              Sign Up 
            </button>
          </div>
          <div className="signupp">
            <h5>
              Already have an account? <Link to="/login"><span><i class="fa-solid fa-right-to-bracket"></i></span></Link>
            </h5>
          </div>
        </form>
      </div>
    </div>
    
    
      );
}

export default SignUp;