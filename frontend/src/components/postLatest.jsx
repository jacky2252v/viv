import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import "./styles/PostLatest.css";

const PostLatest = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.googletag && document.getElementById("responsive-ad")) {
        window.googletag.cmd.push(() => {
          window.googletag.display("responsive-ad");
        });
      }
    }, 500); // small delay ensures DOM is ready

    return () => clearTimeout(timer);
  }, []);

  const handlePostClick = (postId) => {
    if (window.gtag) {
      window.gtag("event", "post_click", {
        post_id: postId,
      });
    } else {
      console.log("Mock post_click:", postId);
    }
  };

  const handleLogOut = (evt) => {
    evt.preventDefault();
    navigate("/");
  };

  const filteredPosts = postData.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="post-latest-container">
        <div className="loader"></div>
        <p className="loading-text">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="post-header">
        <div className="header-content">
          <h1 className="main-title">Latest Posts</h1>
        </div>
        <button className="logout-btn" onClick={handleLogOut}>
          Logout
        </button>
      </header>
      <div className="ad-container">
        <div id="responsive-ad" className="ad-slot"></div>
      </div>
      <div className="posts-section">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">No posts found</p>
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                to={`/post/${post._id}`}
                onClick={() => handlePostClick(post._id)}
                className="post-card-link"
              >
                <article className="post-card">
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-excerpt">{post.description}</p>
                  </div>
                  <div className="post-footer">
                    <span className="read-more">Read More </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostLatest;
