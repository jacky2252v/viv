import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./styles/PostDetail.module.css";

const PostDetail = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="universal-loader-container">
        <div className="universal-loader"></div>
        <p className="universal-loader-text">Loading the article...</p>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className={styles.postDetailContainer}>
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>⚠️</span>
          <h2 className={styles.errorTitle}>Post Not Found</h2>
          <p className={styles.errorMessage}>
            The post you're looking for doesn't exist or has been removed.
          </p>
          <button className={styles.backBtn} onClick={handleBack}>
            ← Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.detailHeader}>
        <div className={styles.headerContent}>
          <button className={styles.backBtn} onClick={handleBack}>
            ← Back
          </button>
        </div>
      </header>

      <article className={styles.postArticle}>
        <div className={styles.articleHeader}>
          <h1 className={styles.postTitle}>{postData.title}</h1>
          {/* Mock author and date since backend doesn't seem to provide it currently */}
          <div className={styles.postMeta}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>A</div>
              <span className={styles.authorName}>Admin</span>
            </div>
            <span className={styles.publishDate}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
        
        {/* Placeholder hero image */}
        <div className={styles.heroImageContainer}>
           <img 
              src={postData.image || `https://source.unsplash.com/random/1200x600?nature,technology,sig=${postData._id}`} 
              alt={postData.title} 
              className={styles.heroImage} 
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80'; }}
            />
        </div>

        <div className={styles.articleContent}>
          <p className={styles.postDescription}>{postData.description}</p>
          
          {postData.content && (
            <div className={styles.postFullContent}>{postData.content}</div>
          )}
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
