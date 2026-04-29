import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const AdminPosts = () => {
  const navigate = useNavigate()
  const handleClick = evt => {
    evt.preventDefault()
    navigate("/admin")
  };

  const [postData, setPostData] = useState()
  useEffect(() => {
    fetch('http://localhost:4000/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log("response", response)
        return response.json();
      })
      .then((data) => {
        console.log("data", data)
        setPostData(data);
      })
      .catch((error) => {
        console.error("error message", error)
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setPostData(postData.filter(post => post._id !== id));
        console.log('Post deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCreate = async (title, descripton) => {
    try {
      const response = await fetch("http://localhost:4000/posts", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'title', description: 'post description here...' })
      })
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }

  return (
    <div>
      <Popup trigger=
        {<button
          style={{
            position: "relative",
            bottom: "5rem",
            left: "30rem"
          }}> Create Post </button>}
        modal nested >
        {
          close => (
            <div className='modal'>
              <form>
                
              </form>
            </div>
          )
        }
      </Popup>
      {/* <button style={{
        position: "relative",
        bottom: "5rem",
        left: "30rem"
      }}
        onClick={handleCreate}
      >
        Create Post
      </button> */}
      <button style={{
        position: "relative",
        bottom: "5rem",
        left: "31rem"
      }}
        onClick={handleClick}
      >
        Back
      </button>
      <div className="container">
        <ul>
          {postData?.map((post) => (
            <li key={post.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {post.title}
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", alignItems: "center" }}>
                <button>Edit</button>
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AdminPosts