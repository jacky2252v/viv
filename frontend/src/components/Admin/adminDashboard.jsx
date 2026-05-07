import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./styles/AdminDashboard.module.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/users`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`)
        ]);
        const users = await usersRes.json();
        const posts = await postsRes.json();
        
        setStats({
          users: users.length || 0,
          posts: posts.length || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogOut = (evt) => {
    evt.preventDefault();
    navigate("/");
  };

  const total = stats.users + stats.posts || 1; // prevent divide by zero
  const usersPercent = Math.round((stats.users / total) * 100);
  const postsPercent = Math.round((stats.posts / total) * 100);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
          <button className={styles.logoutBtn} onClick={handleLogOut}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.dashboardMain}>
        {loading ? (
          <div className="universal-loader-container">
            <div className="universal-loader"></div>
            <p className="universal-loader-text">Loading Reports...</p>
          </div>
        ) : (
          <>
            <section className={styles.reportsSection}>
              <h2 className={styles.sectionTitle}>Overview Reports</h2>
              
              <div className={styles.chartsContainer}>
                {/* CSS Animated Bar Chart */}
                <div className={styles.chartCard}>
                  <h3>System Composition</h3>
                  <div className={styles.barChart}>
                    <div className={styles.barWrapper}>
                      <div className={styles.barValue} style={{"--target-height": `${usersPercent}%`}}>
                        <span>{stats.users}</span>
                      </div>
                      <span className={styles.barLabel}>Users</span>
                    </div>
                    <div className={styles.barWrapper}>
                      <div className={styles.barValue} style={{"--target-height": `${postsPercent}%`, background: "var(--accent-color)"}}>
                        <span>{stats.posts}</span>
                      </div>
                      <span className={styles.barLabel}>Posts</span>
                    </div>
                  </div>
                </div>

                {/* CSS Animated Pie Chart */}
                <div className={styles.chartCard}>
                  <h3>Distribution</h3>
                  <div className={styles.pieChartWrapper}>
                    <div 
                      className={styles.pieChart} 
                      style={{"--p-users": usersPercent, "--p-posts": postsPercent}}
                    >
                      <div className={styles.pieCenter}>
                        <span>{total} Total</span>
                      </div>
                    </div>
                    <div className={styles.pieLegend}>
                      <span className={styles.legendItem}><span className={styles.dot} style={{background: 'var(--text-secondary)'}}></span> Users ({usersPercent}%)</span>
                      <span className={styles.legendItem}><span className={styles.dot} style={{background: 'var(--accent-color)'}}></span> Posts ({postsPercent}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.actionsSection}>
               <h2 className={styles.sectionTitle}>Quick Actions</h2>
               <div className={styles.dashboardCards}>
                <Link to="/admin/users" className={`${styles.dashboardCard} glass-panel`}>
                  <h2 className={styles.cardTitle}>Manage Users</h2>
                  <p className={styles.cardDescription}>
                    View and manage all users in the system
                  </p>
                  <span className={styles.cardAction}>Go to Users →</span>
                </Link>

                <Link to="/admin/posts" className={`${styles.dashboardCard} glass-panel`}>
                  <h2 className={styles.cardTitle}>Manage Posts</h2>
                  <p className={styles.cardDescription}>Create, edit, and delete posts</p>
                  <span className={styles.cardAction}>Go to Posts →</span>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
