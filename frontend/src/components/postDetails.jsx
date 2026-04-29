import { useNavigate, useParams } from "react-router-dom";
import posts from "./data/posts";

const PostDetail = () => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === parseInt(id));

  if (!post) {
    return <h2>Post not found.</h2>;
  }

  const navigate = useNavigate()
  const handleClick = evt => {
    evt.preventDefault()    
    navigate("/post")
  };


  return (
    <div>
        <button style={{
        position: "relative",
        bottom: "15rem",
        left: "35rem"
      }}
        onClick={handleClick}
      >
        Back
      </button>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
};

export default PostDetail;