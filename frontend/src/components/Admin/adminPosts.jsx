import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const AdminPosts = () => {
  const navigate = useNavigate();
  const handleClick = (evt) => {
    evt.preventDefault();
    navigate("/admin");
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postData, setPostData] = useState();
  useEffect(() => {
    fetch("http://localhost:4000/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("response", response);
        return response.json();
      })
      .then((data) => {
        console.log("data", data);
        setPostData(data);
      })
      .catch((error) => {
        console.error("error message", error);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setPostData(postData.filter((post) => post._id !== id));
        console.log("Post deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch("http://localhost:4000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      });
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
    try {
      const response = await fetch(`http://localhost:4000/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      });
      const result = await response.json();
      setPostData(postData.map((post) => (post._id === id ? result : post)));
      console.log("Success:", result);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div>
      <Popup
        trigger={
          <button
            style={{
              position: "relative",
              bottom: "5rem",
              left: "30rem",
            }}
          >
            Create Post
          </button>
        }
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
                close();
              }}
            >
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button type="submit">Create</button>
              <button type="button" onClick={close}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </Popup>
      <button
        style={{
          position: "relative",
          bottom: "5rem",
          left: "31rem",
        }}
        onClick={handleClick}
      >
        Back
      </button>
      <div className="container">
        <ul>
          {postData?.map((post) => (
            <li
              key={post.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {post.title}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <Popup
                  trigger={<button>Edit</button>}
                  onOpen={() => {
                    setTitle(post.title);
                    setDescription(post.description);
                  }}
                  modal
                  nested
                >
                  {(close) => (
                    <div className="modal">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdate(post._id);
                          close();
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        <button type="submit" style={{ marginTop: "5px" }}>
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={close}
                          style={{ marginTop: "5px" }}
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  )}
                </Popup>
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPosts;
