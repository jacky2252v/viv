import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import styles from "./styles/PostLatest.module.css";

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
      <div className={styles["post-latest-container"]}>
        <div className={styles.loader}></div>
        <p className={styles["loading-text"]}>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles["post-header"]}>
        <div className={styles["header-content"]}>
          <h1 className={styles["main-title"]}>Latest Posts</h1>
        </div>
        <button className={styles["logout-btn"]} onClick={handleLogOut}>
          Logout
        </button>
      </header>
      <div className={styles["ad-container"]}>
        <div id="responsive-ad" className={styles["ad-slot"]}></div>
      </div>
      <div className={styles["posts-section"]}>
        {filteredPosts.length === 0 ? (
          <div className={styles["empty-state"]}>
            <p className={styles["empty-text"]}>No posts found</p>
          </div>
        ) : (
          <div className={styles["posts-grid"]}>
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                to={`/post/${post._id}`}
                onClick={() => handlePostClick(post._id)}
                className={styles["post-card-link"]}
              >
                <article className={styles["post-card"]}>
                  <div className={styles["post-content"]}>
                    <h3 className={styles["post-title"]}>{post.title}</h3>
                    <p className={styles["post-excerpt"]}>{post.description}</p>
                  </div>
                  <div className={styles["post-footer"]}>
                    <span className={styles["read-more"]}>Read More </span>
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
