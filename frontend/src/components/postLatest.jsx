import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import styles from "./styles/PostLatest.module.css";

const PostLatest = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const isAdminView = new URLSearchParams(location.search).get("adminView") === "true";

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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`)
      .then((response) => response.json())
      .then((data) => {
        // Reverse to show latest first
        setPostData(data.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  const handleLogOut = (evt) => {
    evt.preventDefault();
    navigate("/");
  };

  const filteredPosts = postData.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const topStories = filteredPosts.slice(1, 4);
  const regularPosts = filteredPosts.slice(4);

  return (
    <div className={styles.newsContainer}>
      {isAdminView && (
        <div className={styles.adminPreviewBar}>
          <div className={styles.adminPreviewLeft}>
            <span className={styles.adminPreviewBadge}>Admin Preview Mode</span>
          </div>
          <div className={styles.adminPreviewCenter}>
            <button className={styles.adminEditBtn}>✏️ Edit Site (Coming Soon)</button>
          </div>
          <div className={styles.adminPreviewRight}>
            <button className={styles.adminBackBtn} onClick={() => navigate("/admin")}>
              ⬅ Back to Admin
            </button>
          </div>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className={styles.newsHeader}>
        <div className={styles.headerTop}>
          <div className={styles.logoArea}>
             <h1 className={styles.logo}>NEWS<span className={styles.accentText}>PLATFORM</span></h1>
          </div>
          <div className={styles.headerControls}>
            <div className={styles.searchBox}>
              <input 
                type="text" 
                placeholder="Search news..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button className={styles.logoutBtn} onClick={handleLogOut} disabled={isAdminView} style={isAdminView ? {opacity: 0.5, cursor: 'not-allowed'} : {}}>
              Logout
            </button>
          </div>
        </div>
        <nav className={styles.navMenu}>
          <ul>
            <li className={styles.active}>Home</li>
            <li>Latest</li>
            <li>Trending</li>
            <li>Technology</li>
            <li>Politics</li>
            <li>Entertainment</li>
          </ul>
        </nav>
      </header>

      <main className={styles.mainContent}>
        {loading ? (
          <div className="universal-loader-container">
            <div className="universal-loader"></div>
            <p className="universal-loader-text">Loading latest news...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>No news articles found.</div>
        ) : (
          <div className={styles.newsGrid}>
            {/* Left Column: Featured & Grid */}
            <div className={styles.leftColumn}>
              
              {/* Featured Post (Hero) */}
              {featuredPost && (
                <Link to={`/post/${featuredPost._id}${isAdminView ? "?adminView=true" : ""}`} className={styles.featuredPostLink}>
                  <article className={styles.featuredPost}>
                    <img 
                      src={featuredPost.image || `https://source.unsplash.com/random/800x500?news,breaking,sig=${featuredPost._id}`}
                      alt={featuredPost.title}
                      className={styles.featuredImg}
                    />
                    <div className={styles.featuredContent}>
                      <span className={styles.categoryBadge}>Top Story</span>
                      <h2>{featuredPost.title}</h2>
                      <p>{featuredPost.description}</p>
                    </div>
                  </article>
                </Link>
              )}

              <div className={styles.sectionDivider}></div>
              <h3 className={styles.sectionTitle}>More News</h3>

              {/* Regular Posts Grid */}
              <div className={styles.regularGrid}>
                {regularPosts.map((post) => (
                  <Link key={post._id} to={`/post/${post._id}${isAdminView ? "?adminView=true" : ""}`} className={styles.cardLink}>
                    <article className={styles.newsCard}>
                      <img 
                        src={post.image || `https://source.unsplash.com/random/400x300?news,sig=${post._id}`}
                        alt={post.title}
                      />
                      <div className={styles.cardContent}>
                        <h4>{post.title}</h4>
                        <span className={styles.readMore}>Read More</span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column: Top Stories / Trending sidebar */}
            <aside className={styles.rightSidebar}>
              <div className={styles.sidebarWidget}>
                <h3 className={styles.widgetTitle}>Trending Stories</h3>
                <div className={styles.trendingList}>
                  {topStories.map((post, index) => (
                    <Link key={post._id} to={`/post/${post._id}${isAdminView ? "?adminView=true" : ""}`} className={styles.trendingItem}>
                      <span className={styles.trendingRank}>{index + 1}</span>
                      <div className={styles.trendingContent}>
                        <h4>{post.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className={styles.sidebarAd}>
                <span>Advertisement</span>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default PostLatest;
