import { Link, useNavigate } from "react-router-dom";
import styles from "./styles/AdminDashboard.module.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogOut = (evt) => {
    evt.preventDefault();
    navigate("/");
  };

  return (
    <div className={styles["dashboard-container"]}>
      <header className={styles["dashboard-header"]}>
        <div className={styles["header-content"]}>
          <h1 className={styles["dashboard-title"]}>Admin Dashboard</h1>
          <button className={styles["logout-btn"]} onClick={handleLogOut}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles["dashboard-main"]}>
        <div className={styles["dashboard-cards"]}>
          <Link to="/admin/users" className={`${styles["dashboard-card"]} ${styles["users-card"]}`}>
            <h2 className={styles["card-title"]}>Manage Users</h2>
            <p className={styles["card-description"]}>
              View and manage all users in the system
            </p>
            <span className={styles["card-action"]}>Go to Users →</span>
          </Link>

          <Link to="/admin/posts" className={`${styles["dashboard-card"]} ${styles["posts-card"]}`}>
            <h2 className={styles["card-title"]}>Manage Posts</h2>
            <p className={styles["card-description"]}>Create, edit, and delete posts</p>
            <span className={styles["card-action"]}>Go to Posts →</span>
          </Link>
        </div>
      </main>

      <footer className={styles["dashboard-footer"]}>
        <p>&copy; 2024 Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
