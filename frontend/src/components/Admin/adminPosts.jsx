import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./styles/AdminPosts.css";

const AdminPosts = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleBack = (evt) => {
    evt.preventDefault();
    navigate("/admin");
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPostData(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("error message", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/posts/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        setPostData(postData.filter((post) => post._id !== id));
        console.log("Post deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/posts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title,
            description: description,
          }),
        },
      );
      const result = await response.json();
      setPostData([...(postData || []), result]);
      setTitle("");
      setDescription("");
      console.log("Success:", result);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleUpdate = async (id) => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/posts/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title,
            description: description,
          }),
        },
      );
      const result = await response.json();
      setPostData(postData.map((post) => (post._id === id ? result : post)));
      console.log("Success:", result);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const filteredPosts = postData.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container">
      <div className="header-right">
        <Popup trigger={<button> Create Post</button>} modal nested>
          {(close) => (
            <div className="modal-content">
              <h2>Create New Post</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreate();
                  close();
                }}
              >
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Enter post description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows="5"
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Create Post
                  </button>
                  <button type="button" className="cancel-btn" onClick={close}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </Popup>
        <button onClick={handleBack}>Back</button>
      </div>

      <main className="posts-main">
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <p>No posts found</p>
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <h3 className="post-title">{post.title}</h3>
                </div>
                <p className="post-description">{post.description}</p>
                <div className="post-actions">
                  <Popup
                    trigger={<button className="edit-btn">Edit</button>}
                    onOpen={() => {
                      setTitle(post.title);
                      setDescription(post.description);
                    }}
                    modal
                    nested
                  >
                    {(close) => (
                      <div className="modal-content">
                        <h2>Edit Post</h2>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate(post._id);
                            close();
                          }}
                        >
                          <div className="form-group">
                            <label>Title</label>
                            <input
                              type="text"
                              placeholder="Enter post title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              placeholder="Enter post description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              required
                              rows="5"
                            ></textarea>
                          </div>
                          <div className="form-actions">
                            <button type="submit" className="save-btn">
                              Update Post
                            </button>
                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={close}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </Popup>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="posts-footer">
        <p>Total Posts: {filteredPosts.length}</p>
      </footer>
    </div>
  );
};

export default AdminPosts;
