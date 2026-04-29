import { Link } from "react-router-dom";
import posts from "./data/posts";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useEffect } from "react";


const PostLatest = () => {
  const navigate = useNavigate()
  const handleLogOut = evt => {
    evt.preventDefault()
    navigate("/")
  };

  const [postData, setPostData] = useState()
 useEffect(() => {
    fetch("http://localhost:4000/posts")
    .then(response => response.json())
        // 4. Setting *dogImage* to the image url that we received from the response above
    .then(data => setPostData(data))
  },[])

  return (
    <div>
      <button style={{
        position: "relative",
        bottom: "15rem",
        left: "35rem"
      }}
        onClick={handleLogOut}
      >
        Logout
      </button>
      <h2>Latest Posts</h2>
      {postData?.map((post) => (
        <div key={post.id} className="post-preview">
          <h3><Link to={`/post/${post.id}`}>{post.title}</Link></h3>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default PostLatest