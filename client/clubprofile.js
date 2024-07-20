
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Clubprofile.css';

function Clubprofile() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const api = "http://localhost:5000";

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const clubResponse = await fetch(`${api}/clubs/${id}`);
        if (!clubResponse.ok) {
          throw new Error(`HTTP error! status: ${clubResponse.status}`);
        }
        const clubData = await clubResponse.json();
        setClub(clubData);
        setEvents(clubData.events);
        setNotifications(clubData.announcements);
      } catch (error) {
        console.error('Error fetching club data:', error);
        setClub(null);
      }
    };

    fetchClubData();
  }, [id]);

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`${api}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${api}/announcements/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleEditEvent = async (eventId) => {
    // Prompt user for new event name and date
    const newEventName = prompt("Enter new event name:");
    const newEventDate = prompt("Enter new event date (in YYYY-MM-DD format):");
    const eventData = {};
    if (newEventName) eventData.name = newEventName;
    if (newEventDate) eventData.date = newEventDate;
    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      
      if (response.ok) {
        console.log(`Event with id ${eventId} updated successfully!`);
      } else {
        console.error(`Error updating event: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating event: ${error}`);
    }
  };

  const handleEditNotification = async (notificationId) => {
    // Implement edit notification logic here
    console.log(`Editing notification with id ${notificationId}`);
  };

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
        <div className='club-events'>
          <div>
            <h2>
              Events
              <span className='add-btn'>
                <Link to="/addform">
                  <i className="fa-solid fa-plus"></i>
                </Link>
              </span>
            </h2>
            <ul>
              {events.map(event => (
                <li key={event.id}>
                  {event.name} - {new Date(event.date).toLocaleDateString()}
                  <div className='toolbox'>
                    <button className='delete-btn' onClick={() => handleDeleteEvent(event.id)}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                    <button className='edit-btn' onClick={() => handleEditEvent(event.id)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='club-notifications'>
          <div>
            <h2>
              Announcements
              <span className='add-btn'>
                <Link to="/addnot">
                  <i className="fa-solid fa-plus"></i>
                </Link>
              </span>
            </h2>
            <ul>
              {notifications.map(notification => (
                <li key={notification.id}>
                  {notification.content}
                  <div className='toolbox'>
                    <button className='delete-btn' onClick={() => handleDeleteNotification(notification.id)}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                    <button className='edit-btn' onClick={() => handleEditNotification(notification.id)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clubprofile;
