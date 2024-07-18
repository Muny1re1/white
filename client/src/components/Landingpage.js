import React from 'react';
import { Link } from 'react-router-dom';
import "./Landingpage.css";

function Landingpage() {
  return (
    <div>
        <div className='landing-page-container'>
            <div className='intro-text'>
                <h1>Welcome to<br/><span>TeenSpace</span></h1>
                <p className='slogan'>Your voice. Your choice. Your community.</p>
            </div>
            <div className='login-btn'>
                <Link to='/login'><i className="fa-solid fa-right-to-bracket"></i>Login</Link>
            </div>
        </div>
    </div>
  );
}

export default Landingpage;
