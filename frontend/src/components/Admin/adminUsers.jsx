import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./styles/AdminUsers.css";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleBack = (evt) => {
    evt.preventDefault();
    navigate("/admin");
  };

  // Fetch Users
  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/users`)
      .then((response) => {
        if (!response.ok) throw new Error("response was not ok");
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("error:", error);
        setLoading(false);
      });
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setUserData(userData.filter((user) => user._id !== id));
        console.log("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
        }),
      });
      const result = await response.json();
      setUserData(userData.map((user) => (user._id === id ? result : user)));
      console.log("Success:", result);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const filteredUsers = userData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container">
      <button onClick={handleBack}>Back</button>

      <main className="users-main">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="user-row">
                    <td className="user-name">{user.name}</td>
                    <td className="user-email">{user.email}</td>
                    <td className="user-actions">
                      <Popup
                        trigger={<button className="edit-btn">Edit</button>}
                        onOpen={() => {
                          setName(user.name);
                          setEmail(user.email);
                        }}
                        modal
                        nested
                      >
                        {(close) => (
                          <div className="modal-content">
                            <h2>Edit User</h2>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate(user._id);
                                close();
                              }}
                            >
                              <div className="form-group">
                                <label>Name</label>
                                <input
                                  type="text"
                                  placeholder="Name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label>Email</label>
                                <input
                                  type="email"
                                  placeholder="Email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="form-actions">
                                <button type="submit" className="save-btn">
                                  Save Changes
                                </button>
                                <button
                                  type="button"
                                  className="cancel-btn"
                                  onClick={close}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </Popup>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="users-footer">
        <p>Total Users: {filteredUsers.length}</p>
      </footer>
    </div>
  );
};

export default AdminUsers;
