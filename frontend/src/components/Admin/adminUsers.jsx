import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);

  const handleClick = (evt) => {
    evt.preventDefault();
    navigate("/admin");
  };

  // Fetch Users
  useEffect(() => {
    fetch('http://localhost:4000/users')
      .then((response) => {
        if (!response.ok) throw new Error('response was not ok');
        return response.json();
      })
      .then((data) => setUserData(data))
      .catch((error) => console.error("error:", error));
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:4000/users/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setUserData(userData.filter(user => user._id !== id));
        console.log('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <button
        style={{ position: "relative", bottom: "5rem", left: "35rem" }}
        onClick={handleClick}
      >
        Back
      </button>
      <div className="container">
        <ul style={{ margin: "5px" }}>
          {userData.map((user) => (
            <li key={user._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              {user.name}
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <button>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminUsers;
