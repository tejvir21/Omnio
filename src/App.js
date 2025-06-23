import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from './pages/Login';
import { Register } from "./pages/Register";
import { Chats } from "./pages/Chats";
import { Profile } from "./pages/Profile";
import { AddFriends } from "./pages/AddFriends";
import { Community } from "./pages/Community";
import { Chat } from "./pages/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<AddFriends />} />
        <Route path="/community" element={<Community />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
