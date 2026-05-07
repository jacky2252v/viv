import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./styles/PostDetail.module.css";

const PostDetail = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.googletag) {
        window.googletag.cmd.push(() => {
          if (window.leftSideRail) {
            window.googletag.display(window.leftSideRail);
          }
          if (window.rightSideRail) {
            window.googletag.display(window.rightSideRail);
          }
        });
      }
    }, 500); // small delay ensures DOM is ready

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (postData) {
      if (window.gtag) {
        window.gtag("event", "post_view", {
          post_id: postData._id,
        });
      } else {
        console.log("Mock post_view:", postData._id);
      }
    }
  }, [postData]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPostData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setLoading(false);
      });
  }, [id]);

  const handleBack = (evt) => {
    evt.preventDefault();
    navigate("/post");
  };

  if (loading) {
    return (
      <div className={styles["post-detail-container"]}>
        <div className={styles.loader}></div>
        <p className={styles["loading-text"]}>Loading post...</p>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className={styles["post-detail-container"]}>
        <div className={styles["error-state"]}>
          <h2 className={styles["error-title"]}>Post Not Found</h2>
          <p className={styles["error-message"]}>
            The post you&apos;re looking for doesn&apos;t exist.
          </p>
          <button className={styles["back-btn"]} onClick={handleBack}>
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles["detail-header"]}>
        <button onClick={handleBack}>Back to Posts</button>
      </header>
      <div className={styles["ad-container"]}>
        <div id="responsive-ad" className={styles["ad-slot"]}></div>
      </div>

      <article className={styles["post-detail"]}>
        <div className={styles["post-detail-content"]}>
          <h1 className={styles["post-title"]}>{postData.title}</h1>
          <div className={styles["post-body"]}>
            <p className={styles["post-description"]}>{postData.description}</p>
          </div>

          {postData.content && (
            <div className={styles["post-full-content"]}>{postData.content}</div>
          )}
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
