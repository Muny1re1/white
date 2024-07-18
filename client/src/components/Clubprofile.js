import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Clubprofile.css';

function ClubProfile() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isMember, setIsMember] = useState(false);

  const handleJoin = async () => {
    try {
      const response = await fetch(`http://localhost:5000/clubs/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
        },
        credentials: 'include',
      });
      if (response.ok) {
        setIsMember(true);
        window.alert("Successfully joined the club!");
      } else {
        console.error('Error joining club:', response.statusText);
        window.alert("Sorry! There was an error in adding you to the club, try again later!");
      }
    } catch (error) {
      console.error('Error joining club:', error);
      window.alert("Sorry! There was an error in adding you to the club, try again later!");
    }
  };

  const handleLeave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/clubs/${id}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
        },
        credentials: 'include',
      });
      if (response.ok) {
        setIsMember(false);
        window.alert("Successfully left the club!");
      } else {
        console.error('Error leaving club:', response.statusText);
        window.alert("Sorry! There was an error in leaving the club, try again later!");
      }
    } catch (error) {
      console.error('Error leaving club:', error);
      window.alert("Sorry! There was an error in leaving the club, try again later!");
    }
  };

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const clubResponse = await fetch(`http://localhost:5000/clubs/${id}`);
        if (!clubResponse.ok) {
          throw new Error(`HTTP error! status: ${clubResponse.status}`);
        }
        const clubData = await clubResponse.json();
        setClub(clubData);
        setEvents(clubData.events);
        setNotifications(clubData.announcements);
      } catch (error) {
        console.error('Error fetching club data:', error);
        setClub(null); // or some default value
      }
    };

    fetchClubData();
  }, [id]);

  if (!club) return <div>Loading...</div>;

  return (
    <div className="club-profile">
      <div>
        <div className="logo1">
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" />
        </div>
        <div className='club-details'>
          <h1>{club.name}</h1>
          <p>{club.description}</p>
          <Link to="/mainpage">
            <i className="fa-solid fa-arrow-left-long"></i>
          </Link>
        </div>
      </div>
      <div className='content'>
        <div className='addformm'>
          <Link to="/addform">
            <i className="fa-solid fa-plus fa-beat"></i>
          </Link>
        </div>
        <div className='club-events'>
          <h2>Events</h2>
          <ul>
            {events.map(event => (
              <li key={event.id}>{event.name} - {new Date(event.date).toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
        <div className='club-notifications'>
          <h2>Announcements</h2>
          <ul>
            {notifications.map(notification => (
              <li key={notification.id}>{notification.content}</li>
            ))}
          </ul>
        </div>
        {!isMember ? (
          <button className='btn-join' onClick={handleJoin}>Join the Club</button>
        ) : (
          <button className='btn-leave' onClick={handleLeave}>Leave the Club</button>
        )}
      </div>
    </div>
  );
}

export default ClubProfile;
