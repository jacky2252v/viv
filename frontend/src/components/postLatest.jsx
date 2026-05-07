import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import styles from "./styles/PostLatest.module.css";

const PostLatest = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        ) : selectedPost ? (
          <div className={styles.newsDetailLayout}>
             {/* Main Article Column */}
             <div className={styles.newsDetailMain}>
                <div className={styles.breadcrumbMock} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span>Home » News » {selectedPost.title.substring(0, 20)}...</span>
                  <button 
                    onClick={() => setSelectedPost(null)} 
                    style={{background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 'bold', padding: '0.3rem 0.8rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem'}}
                  >
                     ← Back
                  </button>
                </div>
                <h1 className={styles.newsDetailTitle}>{selectedPost.title}</h1>
                <h2 className={styles.newsDetailExcerpt}>{selectedPost.description}</h2>
                
                <div className={styles.newsDetailMeta}>
                  <div className={styles.metaLeft}>
                    <div className={styles.authorAvatar}>ND</div>
                    <div className={styles.authorInfo}>
                       <span className={styles.authorName}>By: <strong>News Desk</strong></span>
                       <span className={styles.dateTag}>Published: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                    </div>
                  </div>
                  <div className={styles.metaRight}>
                     <button className={styles.shareBtn}>FB</button>
                     <button className={styles.shareBtn}>X</button>
                     <button className={styles.shareBtn}>WA</button>
                  </div>
                </div>

                <div className={styles.newsDetailImageWrapper}>
                   <img 
                     src={selectedPost.image || `https://source.unsplash.com/random/1000x500?news,sig=${selectedPost._id}`} 
                     alt={selectedPost.title} 
                     className={styles.newsDetailImage}
                   />
                   <span className={styles.imageCaption}>File photo representing the latest updates on the story. (Image: Unsplash)</span>
                </div>

                <div className={styles.newsDetailContent}>
                  <p>
                     <strong>New Delhi:</strong> {selectedPost.content || "No extended content provided for this post. News18 style articles typically feature multiple paragraphs of in-depth reporting, quotes from official sources, and embedded media. This is a placeholder demonstrating the typography and line-spacing of the main article body."}
                  </p>
                  <p>
                    Authorities have stated that they are closely monitoring the situation. Representatives from various sectors have voiced their opinions, urging the public to remain calm while investigations continue.
                  </p>
                  <p>
                    In a related development, market experts predict that the fallout from these events may influence short-term economic policies. "We are looking at a volatile week ahead," an analyst remarked during a press briefing earlier today.
                  </p>
                </div>
             </div>

             {/* Right Sidebar Column */}
             <aside className={styles.newsDetailSidebar}>
                <div className={styles.sidebarAdRect}>Advertisement</div>
                
                <div className={styles.sidebarWidget}>
                  <h3 className={styles.widgetTitle}>More News</h3>
                  <div className={styles.trendingList}>
                    {topStories.map((post, index) => (
                      <div key={post._id} onClick={() => { window.scrollTo(0, 0); setSelectedPost(post); }} className={styles.trendingItem} style={{cursor: 'pointer'}}>
                        <span className={styles.trendingRank}>{index + 1}</span>
                        <div className={styles.trendingContent}>
                          <h4>{post.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </aside>
          </div>
        ) : (
          <div className={styles.newsGrid}>
            {/* Left Column: Featured & Grid */}
            <div className={styles.leftColumn}>
              
              {/* Featured Post (Hero) */}
              {featuredPost && (
                <div onClick={() => setSelectedPost(featuredPost)} className={styles.featuredPostLink} style={{cursor: 'pointer'}}>
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
                </div>
              )}

              <div className={styles.sectionDivider}></div>
              <h3 className={styles.sectionTitle}>More News</h3>

              {/* Regular Posts Grid */}
              <div className={styles.regularGrid}>
                {regularPosts.map((post) => (
                  <div key={post._id} onClick={() => setSelectedPost(post)} className={styles.cardLink} style={{cursor: 'pointer'}}>
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
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Top Stories / Trending sidebar */}
            <aside className={styles.rightSidebar}>
              <div className={styles.sidebarWidget}>
                <h3 className={styles.widgetTitle}>Trending Stories</h3>
                <div className={styles.trendingList}>
                  {topStories.map((post, index) => (
                    <div key={post._id} onClick={() => setSelectedPost(post)} className={styles.trendingItem} style={{cursor: 'pointer'}}>
                      <span className={styles.trendingRank}>{index + 1}</span>
                      <div className={styles.trendingContent}>
                        <h4>{post.title}</h4>
                      </div>
                    </div>
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

      {/* Floating Scroll to Top Button */}
      {showTopBtn && (
        <button className={styles.scrollToTopBtn} onClick={scrollToTop} aria-label="Scroll to top">
          ↑ Top
        </button>
      )}
    </div>
  );
};

export default PostLatest;
