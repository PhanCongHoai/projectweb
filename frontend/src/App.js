import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Thêm Router
import SearchBar from "./components/SearchBar/SearchBar";
import Footer from "./components/Footer/Footer";
import Event from "./components/Event/Event";
import Category from "./components/Category/Category";
import Advertisement from "./components/Advertisement/Advertisement";
import Login_Register_Form from "./components/Login_Register/Login_Register";
import Admin from "./components/Admin/Admin";
const HomePage = () => {
  return (
    <main>
      <Advertisement />
      <Category />
      <Event />
    </main>
  );
};

function App() {
  return (
    <Router>
      <div className="Main">
        <SearchBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login_Register_Form />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
