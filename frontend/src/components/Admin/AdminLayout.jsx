import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./styles/AdminLayout.module.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || 
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className={styles.sidebarOverlay} 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2>Admin<span>Panel</span></h2>
        </div>
        
        <nav className={styles.sidebarNav}>
          <ul>
            <li>
              <Link 
                to="/admin" 
                className={location.pathname === "/admin" ? styles.active : ""}
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/posts" 
                className={location.pathname.includes("/admin/posts") ? styles.active : ""}
              >
                📝 Manage Posts
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className={location.pathname.includes("/admin/users") ? styles.active : ""}
              >
                👥 Manage Users
              </Link>
            </li>
            <li>
              <Link to="/post?adminView=true">
                🌐 View Site
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
           <button className={styles.themeBtn} onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
           </button>
           <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.topbar}>
           <div className={styles.breadcrumb}>
             <button 
                className={styles.mobileMenuBtn} 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
               ☰
             </button>
             Admin / {location.pathname.split('/').pop() || 'Dashboard'}
           </div>
           <div className={styles.adminProfile}>
              <span>Admin User</span>
              <div className={styles.avatar}>A</div>
           </div>
        </div>
        
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
