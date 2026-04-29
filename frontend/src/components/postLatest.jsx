import { Link } from "react-router-dom";
import posts from "./data/posts";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useEffect } from "react";

const PostLatest = () => {
  const navigate = useNavigate();
  const handleLogOut = (evt) => {
    evt.preventDefault();
    navigate("/");
  };

  const [postData, setPostData] = useState();
  useEffect(() => {
    fetch("http://localhost:4000/posts")
      .then((response) => response.json())
      .then((data) => setPostData(data));
  }, []);

  return (
    <div>
      <button
        style={{
          position: "relative",
          bottom: "15rem",
          left: "35rem",
        }}
        onClick={handleLogOut}
      >
        Logout
      </button>
      <h2>Latest Posts</h2>
      {postData?.map((post) => (
        <div key={post._id} className="post-preview">
          <h3>
            <Link to={`/post/${post._id}`}>{post.title}</Link>
          </h3>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default PostLatest;
