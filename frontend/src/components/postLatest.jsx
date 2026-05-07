import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import styles from "./styles/PostLatest.module.css";

const PostLatest = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
        setPostData(data);
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.mainTitle}>Latest Posts</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchWrapper}>
             <input 
               type="text" 
               className={styles.searchInput}
               placeholder="Search articles..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button className={styles.logoutBtn} onClick={handleLogOut}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        {loading ? (
          <div className="universal-loader-container">
            <div className="universal-loader"></div>
            <p className="universal-loader-text">Discovering amazing content...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📝</span>
            <p>No posts found matching your criteria</p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                to={`/post/${post._id}`}
                className={styles.postCardLink}
              >
                <article className={styles.postCard}>
                  <div className={styles.imageContainer}>
                    {/* Placeholder image since backend doesn't store images in standard setup, but you can replace src if it does */}
                    <img 
                      src={post.image || `https://source.unsplash.com/random/800x600?nature,technology,sig=${post._id}`} 
                      alt={post.title} 
                      className={styles.postImage} 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'; }}
                    />
                    
                    <div className={styles.postOverlay}>
                      <div className={styles.overlayContent}>
                        <h3 className={styles.postTitle}>{post.title}</h3>
                        <div className={styles.slidingContent}>
                          <p className={styles.postExcerpt}>{post.description}</p>
                          <span className={styles.readMore}>
                            Read Full Article <span className={styles.arrow}>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PostLatest;
