import "./Event.css";
const Category = ({ icon, title, subtitle }) => (
  <div className="category-item">
    <div
      className="category-icon"
      style={{ backgroundColor: icon.backgroundColor }}
    >
      <img src={icon.url} alt={title} className="category-icon-img" />
    </div>
    <h3 className="category-title">{title}</h3>
    <p className="category-subtitle">{subtitle}</p>
  </div>
);

const App = () => {
  const categories = [
    {
      icon: { url: "/img/game-dua-top.png", backgroundColor: "#ff3333" }, // Thay bằng đường dẫn icon thực tế
      title: "Game Đùa Top",
      subtitle: "",
    },
    {
      icon: { url: "/img/day.png", backgroundColor: "#ff6666" },
      title: "ĐDay 15.03",
      subtitle: "",
    },
    {
      icon: { url: "/img/dinh-ti.png", backgroundColor: "#ff9999" },
      title: "Đình Tí",
      subtitle: "",
    },
    {
      icon: { url: "/img/mcbook.png", backgroundColor: "#3399ff" },
      title: "MCBooks",
      subtitle: "",
    },
    {
      icon: { url: "/img/mgg.png", backgroundColor: "#66ccff" },
      title: "Mã Giảm Giá",
      subtitle: "",
    },
    {
      icon: { url: "/img/spm.png", backgroundColor: "#ffcc66" },
      title: "Săn Phẩm Mới",
      subtitle: "",
    },
    {
      icon: { url: "/img/spdtg.png", backgroundColor: "#ff99cc" },
      title: "Săn Phẩm Được Trợ Giá",
      subtitle: "",
    },
    {
      icon: { url: "/img/pcc.png", backgroundColor: "#33cc99" },
      title: "Phiên Chợ CũCũ",
      subtitle: "",
    },
    {
      icon: { url: "/img/bs.png", backgroundColor: "#ff6666" },
      title: "Bán Sỉ",
      subtitle: "",
    },
    {
      icon: { url: "/img/mgg.png", backgroundColor: "#ff99cc" },
      title: "Manga",
      subtitle: "",
    },
  ];

  return (
    <div className="app">
      <div className="category-list">
        {categories.map((category, index) => (
          <Category key={index} {...category} />
        ))}
      </div>
    </div>
  );
};

export default App;
