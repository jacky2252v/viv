import { Link, useNavigate } from "react-router-dom";
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogOut = (evt) => {
    evt.preventDefault();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <button className="logout-btn" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-cards">
          <Link to="/admin/users" className="dashboard-card users-card">
            <h2 className="card-title">Manage Users</h2>
            <p className="card-description">
              View and manage all users in the system
            </p>
            <span className="card-action">Go to Users →</span>
          </Link>

          <Link to="/admin/posts" className="dashboard-card posts-card">
            <h2 className="card-title">Manage Posts</h2>
            <p className="card-description">Create, edit, and delete posts</p>
            <span className="card-action">Go to Posts →</span>
          </Link>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2024 Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
