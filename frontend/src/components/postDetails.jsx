import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const PostDetail = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:4000/posts/${id}`)
      .then((response) => response.json())
      .then((data) => setPostData(data));
  }, []);

  if (!postData) {
    return <h2>Post not found.</h2>;
  }

  const handleClick = (evt) => {
    evt.preventDefault();
    navigate("/post");
  };

  return (
    <div>
      <button
        style={{
          position: "relative",
          bottom: "15rem",
          left: "35rem",
        }}
        onClick={handleClick}
      >
        Back
      </button>
      <h2>{postData?.title}</h2>
      <p>{postData?.description}</p>
    </div>
  );
};

export default PostDetail;
