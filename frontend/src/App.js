import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./utils/axiosConfig";
import SearchBar from "./components/SearchBar/SearchBar";
import CategoryPage from "./components/Category/CategoryPage";
import Footer from "./components/Footer/Footer";
import LoginRegisterForm from "./components/LoginRegister/LoginRegister";
import Home from "./pages/home";
import AdminPage from "./pages/admin";

import ResetPassword from './components/ResetPassword/ResetPassword'; // Form yêu cầu reset
import ResetPasswordPage from './components/ResetPassword/ResetPasswordPage'; // Trang reset từ email

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
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}







export default App;