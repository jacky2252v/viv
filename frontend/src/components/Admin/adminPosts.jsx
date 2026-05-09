import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import styles from "./styles/AdminPosts.module.css";

const AdminPosts = () => {
  const [postData, setPostData] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // Preview State
  const [previewPost, setPreviewPost] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`)
      .then((response) => {
        if (!response.ok) throw new Error("response was not ok");
        return response.json();
      })
      .then((data) => {
        setPostData(data.reverse()); // Latest first
        setLoading(false);
      })
      .catch((error) => {
        console.error("error:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setPostData(postData.filter((post) => post._id !== id));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, content }),
      });
      const result = await response.json();
      setPostData([result, ...postData]);
      setTitle(""); setDescription(""); setContent("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, content }),
      });
      const result = await response.json();
      setPostData(postData.map((post) => (post._id === id ? result : post)));
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Title", "Description"];
    const csvContent = [
      headers.join(","),
      ...postData.map(p => `"${p._id}","${p.title?.replace(/"/g, '""')}","${p.description?.replace(/"/g, '""')}"`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "posts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPosts = postData.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // State for Edit Modal
  const [editingPost, setEditingPost] = useState(null);

  const openEditModal = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setContent(post.content || "");
  };

  const closeEditModal = () => {
    setEditingPost(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.tableHeader}>
        <div className={styles.headerControls}>
          <input
            type="text"
            placeholder="Search posts..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className={styles.actionButtons}>
            <button className={styles.exportBtn} onClick={exportToCSV}>
               📥 Export CSV
            </button>
            <Popup 
              trigger={<button className={styles.createBtn}>➕ Create Post</button>} 
              modal nested className="centered-modal"
            >
              {(close) => (
                <div className={styles.modalContent}>
                  <h2>Create New Post</h2>
                  <form onSubmit={(e) => { e.preventDefault(); handleCreate(); close(); }}>
                    <div className={styles.formGroup}>
                      <label>Title</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Full Content</label>
                      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="5" />
                    </div>
                    <div className={styles.formActions}>
                      <button type="button" className={styles.cancelBtn} onClick={close}>Cancel</button>
                      <button type="submit" className={styles.saveBtn}>🚀 Publish</button>
                    </div>
                  </form>
                </div>
              )}
            </Popup>
          </div>
        </div>
      </header>

      <main className={styles.postsMain}>
        {loading ? (
          <div className="universal-loader-container">
            <div className="universal-loader"></div>
            <p className="universal-loader-text">Loading posts...</p>
          </div>
        ) : currentPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No posts found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.postsTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Excerpt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post) => (
                  <tr 
                    key={post._id} 
                    className={styles.postRow}
                    onClick={() => {
                      if (window.innerWidth <= 768) setPreviewPost(post);
                    }}
                  >
                    <td className={styles.postTitleCol}>{post.title}</td>
                    <td className={styles.postDescCol}>{post.description}</td>
                    <td className={styles.postActions}>
                      
                      <button 
                        className={styles.previewBtn} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewPost(post);
                        }}
                      >
                        👁️ Preview
                      </button>

                      <button 
                        className={styles.editBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(post);
                        }}
                      >
                        ✏️ Edit
                      </button>

                      <button 
                        className={styles.deleteBtn} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post._id);
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Global Edit Modal */}
      <Popup
        open={!!editingPost}
        onClose={closeEditModal}
        modal
        nested
        className="centered-modal"
      >
        <div className={styles.modalContent}>
          <h2>Edit Post</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(editingPost._id); closeEditModal(); }}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" />
            </div>
            <div className={styles.formGroup}>
              <label>Full Content</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="5" />
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={closeEditModal}>Cancel</button>
              <button type="submit" className={styles.saveBtn}>💾 Save</button>
            </div>
          </form>
        </div>
      </Popup>

      {!loading && filteredPosts.length > 0 && (
        <footer className={styles.pagination}>
           <span className={styles.pageInfo}>Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length}</span>
           <div className={styles.pageControls}>
             <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
             <span className={styles.pageNumber}>{currentPage} / {totalPages}</span>
             <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
           </div>
        </footer>
      )}

      {/* Preview Modal overlay manually managed to ensure it acts like Client Side */}
      {previewPost && (
        <div className={styles.previewOverlay} onClick={() => setPreviewPost(null)}>
           <div className={styles.previewModal} onClick={e => e.stopPropagation()}>
               <div className={styles.previewHeader}>
                  <h3>Post Preview</h3>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <button 
                      className={styles.editBtn} 
                      onClick={() => {
                        openEditModal(previewPost);
                        setPreviewPost(null);
                      }}
                      style={{display: 'block', background: 'var(--accent-color)', color: 'white', padding: '0.5rem 1rem'}}
                    >
                      ✏️ Edit Post
                    </button>
                    <button className={styles.closePreviewBtn} onClick={() => setPreviewPost(null)}>×</button>
                  </div>
               </div>
              <div className={styles.previewBody}>
                  {/* Simulate the client side post view */}
                  <h1 style={{fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)'}}>{previewPost.title}</h1>
                  <p style={{fontSize: '1.2rem', fontStyle: 'italic', borderLeft: '4px solid var(--accent-color)', paddingLeft: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem'}}>
                    {previewPost.description}
                  </p>
                  <img 
                    src={previewPost.image || `https://source.unsplash.com/random/800x400?news,sig=${previewPost._id}`} 
                    alt="Hero" 
                    style={{width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '2rem'}}
                  />
                  <div style={{fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-primary)'}}>
                    {previewPost.content || "No extended content provided."}
                  </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .centered-modal-content {
          margin: auto !important;
          background: transparent !important;
          border: none !important;
          width: auto !important;
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminPosts;
