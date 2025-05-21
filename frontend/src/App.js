import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./utils/axiosConfig";
import SearchBar from "./components/SearchBar/SearchBar";
import Footer from "./components/Footer/Footer";
import LoginRegisterForm from "./components/LoginRegister/LoginRegister";
import Home from "./pages/home";
import AdminPage from "./pages/admin";

function App() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => {
        if (res.data.code === 200) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.error("Lỗi fetch categories:", err));
  }, []);

  return (
    <Router>
      <div className="Main">
        <SearchBar />
        <Routes>
          <Route path="/" element={<Home categories={categories} />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginRegisterForm />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
