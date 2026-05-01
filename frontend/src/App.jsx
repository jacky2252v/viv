import React from "react";
import Hero from "./components/Hero";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import PostDetail from "./components/postDetails";
import PostLatest from "./components/postLatest";
import AdminDashboard from "./components/Admin/adminDashboard";
import AdminUsers from "./components/Admin/adminUsers";
import AdminPosts from "./components/Admin/adminPosts";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hero />} />

          {/* Posts */}
          <Route path="/post" element={<PostLatest />} />
          <Route path="/post/:id" element={<PostDetail />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
        </Routes>
      </BrowserRouter>
      {/* <Hero /> */}
    </div>
  );
}

export default App;
