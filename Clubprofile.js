import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Clubprofile.css';

function Clubprofile() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const api = "http://localhost:5000";

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const clubResponse = await fetch(`${api}/clubs/${id}`, {
          credentials: 'include', // Include cookies in the request
        });
        if (!clubResponse.ok) {
          throw new Error(`HTTP error! status: ${clubResponse.status}`);
        }
        const clubData = await clubResponse.json();
        setClub(clubData);
        setEvents(clubData.events);
        setNotifications(clubData.announcements);

        // Check if the user is a member of the club
        const userResponse = await fetch(`${api}/checksession`, {
          credentials: 'include',
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const isMember = userData.user.clubs.some(club => club.id === parseInt(id));
          setIsMember(isMember);
        } else {
          setIsMember(false);
        }
      } catch (error) {
        console.error('Error fetching club data:', error);
        setClub(null);
      }
    };

    fetchClubData();
  }, [id, api]);

  const handleJoin = async () => {
    try {
      const response = await fetch(`${api}/clubs/${id}/join`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Joined club successfully:', data);
      setIsMember(true); // Update state to reflect that the user is now a member
    } catch (error) {
      console.error('Error joining club:', error);
    }
  };

  const handleLeave = async () => {
    try {
      const response = await fetch(`${api}/clubs/${id}/leave`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Left club successfully:', data);
      setIsMember(false); // Update state to reflect that the user is no longer a member
    } catch (error) {
      console.error('Error leaving club:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`${api}/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies in the request
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
        credentials: 'include', // Include cookies in the request
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
    const newEventName = prompt("Enter new event name:");
    if (!newEventName) {
      console.log('No event name entered.');
      return;
    }
    const eventData = { name: newEventName };
    try {
      const response = await fetch(`${api}/events/${eventId}`, {
        method: 'PATCH',
        credentials: 'include', // Include cookies in the request
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
  
      if (response.ok) {
        console.log(`Event with id ${eventId} updated successfully!`);
        // Update the state with the new event data
        setEvents(events.map(event => event.id === eventId ? { ...event, ...eventData } : event));
      } else {
        console.error(`Error updating event: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating event: ${error}`);
    }
  };
  

  const handleEditNotification = async (notificationId) => {
    const newNotificationContent = prompt("Enter new notification content:");
    const notificationData = { content: newNotificationContent };
    try {
      const response = await fetch(`${api}/announcements/${notificationId}`, {
        method: 'PATCH',
        credentials: 'include', // Include cookies in the request
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });

      if (response.ok) {
        console.log(`Notification with id ${notificationId} updated successfully!`);
        // Update the state with the new notification data
        setNotifications(notifications.map(notification => notification.id === notificationId ? { ...notification, ...notificationData } : notification));
      } else {
        console.error(`Error updating notification: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating notification: ${error}`);
    }
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

        <div className='join-leave-btn'>
          {isMember ? (
            <button className='leave-btn' onClick={handleLeave}><span className='centered-text'>Leave Club</span></button>
          ) : (
            <button className='join-btn' onClick={handleJoin}><span className='centered-text'>Join Club</span></button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Clubprofile;
