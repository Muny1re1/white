import React from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Credentials': 'true',
          },
          body: JSON.stringify(values),
          credentials: "include",  // Include credentials for cross-origin requests
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Login successful:", data);
        window.alert("Welcome back to your TeenSpace account");
        resetForm();
        // Redirect to main page or club dashboard
        navigate("/mainpage");
      } catch (error) {
        console.log(error);
        window.alert("Login failed. Please check your credentials and try again.");
      }
    },
  });

  const grinningEmoji = "😁";

  return (
    <div className="login">
      <div className="btn btn-back">
        <Link to="/">
          <i className="fa-solid fa-arrow-left-long"></i>
        </Link>
      </div>
      <div className="form-container starter">
        <form onSubmit={formik.handleSubmit}>
          <h1>Welcome Back</h1>
          <h2 className="emoji">{grinningEmoji}</h2>
          <h3>Sign in with your TeenSpace account</h3>
          <p>Let's get you signed in and straight to your activities</p>
          <div className="form-group">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div className="form-group">
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              required
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="form-group">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <i className="fa-solid fa-lock"></i>
          </div>

          <div className="remfo">
            <div className="check">
              <input type="checkbox" name="remember" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <div>Forgot Password?</div>
          </div>

          <div className="btnn">
            <button className="login-btn" type="submit">
              Login
            </button>
          </div>

          <div className="signupp">
            <h5>
              Don't have an account?
              <Link to="/signup">
                <span>
                  <i className="fa-solid fa-user-plus"></i>
                </span>
              </Link>
            </h5>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;