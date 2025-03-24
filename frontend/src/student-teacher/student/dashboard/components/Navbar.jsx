// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const [user, setUser] = useState(null); // Store user info (null = not logged in)

  useEffect(() => {
    // Simulate getting user data from localStorage or API after login
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🏆 AssesRank</Link>
      </div>
      
      {/* <div className="nav-links"> */}
        {/* <a href="#" className="active"><h1>Student Dashboard</h1></a> */}
        {/* <a href="#">Courses</a>
        <a href="#">Resources</a>
        <a href="#">Messages</a> */}
      {/* </div> */}
      
      <div className="nav-actions">
        <div className="notification-bell">
          <button onClick={() => setShowNotifications(!showNotifications)}>
            <span className="icon">🔔</span>
            {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <h3>Notifications</h3>
              {notifications.length ? (
                <ul>
                  {notifications.map(notification => (
                    <li key={notification.id} className={`notification-item ${notification.type}`}>
                      {notification.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-notifications">No new notifications</p>
              )}
            </div>
          )}
        </div>
        <div className="user-profile">
          <div className="avatar">
            <span>JS</span>
          </div>
          <span className="username">John Student</span>
        </div>
        <div className="navbar-actions">
          {user ? (
            <div className="profile-section">
              <img src={user.profilePic} alt="User" className="profile-pic" />
            </div>
          ) : (
            <Link to="/#login">
              {/* add function to clear cookies */}
              <button className="login-btn">Logout</button>
            </Link>
          )}
        </div>
        
    </div>
        
      {/* </div> */}
    {/* </div>   */}
  </nav>
  );
};

export default Navbar;
