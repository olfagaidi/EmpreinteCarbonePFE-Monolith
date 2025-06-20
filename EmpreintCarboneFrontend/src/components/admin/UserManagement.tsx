import React from "react";
import { Routes, Route } from "react-router-dom";
import UserList from "./UserList";
import UserDetail from "./UserDetail";
import UserRegistration from "./UserRegistration"; 

const UserManagement = () => {
  return (
    <div className="container mx-auto py-6">
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/view/:userId" element={<UserDetail />} />
        <Route path="/edit/:userId" element={<UserRegistration />} />
        <Route path="/add" element={<UserRegistration />} />
      </Routes>
    </div>
  );
};

export default UserManagement;
