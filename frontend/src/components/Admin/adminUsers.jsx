import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import styles from "./styles/AdminUsers.module.css";

const AdminUsers = () => {
  const [userData, setUserData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        setUserData(userData.filter((user) => user._id !== id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        },
      );
      const result = await response.json();
      setUserData(userData.map((user) => (user._id === id ? result : user)));
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email"];
    const csvContent = [
      headers.join(","),
      ...userData.map(u => `"${u._id}","${u.name}","${u.email}"`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = userData.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className={styles.container}>
      <header className={styles.tableHeader}>
        <div className={styles.headerControls}>
          <input
            type="text"
            placeholder="Search users..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button className={styles.exportBtn} onClick={exportToCSV}>
             📥 Export CSV
          </button>
        </div>
      </header>

      <main className={styles.usersMain}>
        {loading ? (
          <div className="universal-loader-container">
            <div className="universal-loader"></div>
            <p className="universal-loader-text">Loading users...</p>
          </div>
        ) : currentUsers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No users found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id} className={styles.userRow}>
                    <td className={styles.userName}>{user.name}</td>
                    <td className={styles.userEmail}>{user.email}</td>
                    <td className={styles.userActions}>
                      <Popup
                        trigger={<button className={styles.editBtn}>✏️ Edit</button>}
                        onOpen={() => {
                          setName(user.name);
                          setEmail(user.email);
                        }}
                        modal
                        nested
                        className="centered-modal"
                      >
                        {(close) => (
                          <div className={styles.modalContent}>
                            <h2>Edit User Profile</h2>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate(user._id);
                                close();
                              }}
                            >
                              <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  required
                                />
                              </div>
                              <div className={styles.formGroup}>
                                <label>Email Address</label>
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                />
                              </div>
                              <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={close}>Cancel</button>
                                <button type="submit" className={styles.saveBtn}>💾 Save</button>
                              </div>
                            </form>
                          </div>
                        )}
                      </Popup>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(user._id)}>
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {!loading && filteredUsers.length > 0 && (
        <footer className={styles.pagination}>
           <span className={styles.pageInfo}>Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}</span>
           <div className={styles.pageControls}>
             <button 
               disabled={currentPage === 1} 
               onClick={() => setCurrentPage(p => p - 1)}
             >
               Prev
             </button>
             <span className={styles.pageNumber}>{currentPage} / {totalPages}</span>
             <button 
               disabled={currentPage === totalPages} 
               onClick={() => setCurrentPage(p => p + 1)}
             >
               Next
             </button>
           </div>
        </footer>
      )}

      <style>{`
        /* Global override for centered popup */
        .centered-modal-content {
          margin: auto !important;
          background: transparent !important;
          border: none !important;
          width: auto !important;
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;
