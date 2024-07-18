import React from 'react';
import { Link } from 'react-router-dom';
import "./Card.css"
function Clubcard({ club }) {
  console.log('Club data received in Clubcard:', club);
  return (
    <div className="club-card">
      <Link to={`/club/${club.id}`}>
        <h3>{club.name}</h3>
      </Link>
      <p>{club.description}</p>
    </div>
  );
}


export default Clubcard;
