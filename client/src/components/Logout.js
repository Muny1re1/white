import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Logout({ onLogout }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Logout successful:", data);
      // Update your app state to reflect the logout
      setShowModal(false);

      // Redirect to the landing page
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Link to="#" onClick={() => setShowModal(true)}>
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
      </Link>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h1>Are you sure you want to logout?</h1>
            {/* <button onClick={handleLogout}> */}
            <button onClick={handleLogout}>
              Yes
            </button>
            {/* </button> */}
            <button onClick={handleModalClose}>
              No
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Logout;