import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleClick = (evt) => {
    evt.preventDefault();
    navigate("/admin");
  };

  // Fetch Users
  useEffect(() => {
    fetch("http://localhost:4000/users")
      .then((response) => {
        if (!response.ok) throw new Error("response was not ok");
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
      const response = await fetch(`http://localhost:4000/users/${id}`, {
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
          {userData?.map((user) => (
            <li
              key={user._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              {user.name}
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                <Popup
                  trigger={<button>Edit</button>}
                  onOpen={() => {
                    setName(user.name);
                    setEmail(user.email);
                  }}
                  modal
                  nested
                >
                  {(close) => (
                    <div className="modal">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdate(user._id);
                          close();
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" style={{ marginTop: "5px" }}>
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={close}
                          style={{ marginTop: "5px" }}
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  )}
                </Popup>
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
