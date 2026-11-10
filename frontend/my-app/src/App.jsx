import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostWrite from "./pages/PostWrite";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/write" element={<PostWrite />} />
      <Route path="/posts/:postId/edit" element={<PostWrite />} />
    </Routes>
  );
}