import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="post-detail-container">
        <div className="loader"></div>
        <p className="loading-text">Loading post...</p>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="post-detail-container">
        <div className="error-state">
          <h2 className="error-title">Post Not Found</h2>
          <p className="error-message">
            The post you&apos;re looking for doesn&apos;t exist.
          </p>
          <button className="back-btn" onClick={handleBack}>
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="detail-header">
        <button onClick={handleBack}>Back to Posts</button>
      </header>
      <div id="static-ad-1" style={{ width: "100px", height: "100px" }}></div>
      <article className="post-detail">
        <div className="post-detail-content">
          <h1 className="post-title">{postData.title}</h1>
          <div className="post-body">
            <p className="post-description">{postData.description}</p>
          </div>

          {postData.content && (
            <div className="post-full-content">{postData.content}</div>
          )}
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
