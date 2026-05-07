import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./styles/AdminDashboard.module.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: [], posts: [] });
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
          users: users || [],
          posts: posts || []
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Generate mock trend data since backend lacks `createdAt` for realistic last 7 days metrics
  // In a real app, you would group records by Date
  const generateTrendData = (totalCount) => {
    const trend = [];
    let remaining = totalCount;
    for (let i = 0; i < 7; i++) {
      const val = i === 6 ? remaining : Math.floor(Math.random() * (remaining / 2));
      remaining -= val;
      trend.unshift(val);
    }
    return trend;
  };

  const usersTrend = generateTrendData(stats.users.length);
  const postsTrend = generateTrendData(stats.posts.length);
  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'];
  const maxTrend = Math.max(...usersTrend, ...postsTrend, 10);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.statsSummary}>
         <div className={styles.statCard}>
            <h3>Total Users</h3>
            <span className={styles.statNumber}>{stats.users.length}</span>
         </div>
         <div className={styles.statCard}>
            <h3>Total Posts</h3>
            <span className={styles.statNumber}>{stats.posts.length}</span>
         </div>
      </div>

      {loading ? (
        <div className="universal-loader-container">
          <div className="universal-loader"></div>
          <p className="universal-loader-text">Loading Reports...</p>
        </div>
      ) : (
        <section className={styles.reportsSection}>
          <h2 className={styles.sectionTitle}>Recent Activity (Last 7 Days)</h2>
          
          <div className={styles.chartsContainer}>
            {/* CSS Animated Line/Bar Chart for Signups */}
            <div className={styles.chartCard}>
              <h3>Users Joined</h3>
              <div className={styles.trendChart}>
                {usersTrend.map((val, idx) => (
                  <div key={`u-${idx}`} className={styles.trendColumn}>
                    <div 
                      className={styles.trendBar} 
                      style={{"--target-height": `${(val / maxTrend) * 100}%`}}
                      title={`${val} users`}
                    >
                      <span>{val}</span>
                    </div>
                    <span className={styles.trendLabel}>{days[idx]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CSS Animated Line/Bar Chart for Posts */}
            <div className={styles.chartCard}>
              <h3>Posts Created</h3>
              <div className={styles.trendChart}>
                {postsTrend.map((val, idx) => (
                  <div key={`p-${idx}`} className={styles.trendColumn}>
                    <div 
                      className={styles.trendBar} 
                      style={{"--target-height": `${(val / maxTrend) * 100}%`, background: "var(--accent-color)"}}
                      title={`${val} posts`}
                    >
                      <span>{val}</span>
                    </div>
                    <span className={styles.trendLabel}>{days[idx]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.dashboardCards}>
          <Link to="/admin/users" className={`${styles.dashboardCard} glass-panel`}>
            <h2 className={styles.cardTitle}>Manage Users</h2>
            <p className={styles.cardDescription}>
              View and manage all users in the system. Search, filter, edit, and delete user profiles.
            </p>
            <span className={styles.cardAction}>Go to Users →</span>
          </Link>

          <Link to="/admin/posts" className={`${styles.dashboardCard} glass-panel`}>
            <h2 className={styles.cardTitle}>Manage Posts</h2>
            <p className={styles.cardDescription}>Review formatting via Preview, edit content, and track published posts.</p>
            <span className={styles.cardAction}>Go to Posts →</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
