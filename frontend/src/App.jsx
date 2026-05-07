import React from "react";
import Hero from "./components/Hero";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PostDetail from "./components/postDetails";
import PostLatest from "./components/postLatest";
import AdminLayout from "./components/Admin/AdminLayout";
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

          {/* Admin Routes with Sidebar Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="posts" element={<AdminPosts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
