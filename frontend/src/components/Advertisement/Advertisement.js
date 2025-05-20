import React from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // Thư viện hỗ trợ các thanh trượttrượt
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Advertisement.css";


import qc1 from "../../assets/img/qc5.png";
import qc3 from "../../assets/img/qc3.png";


const Home = () => {
  const ads = [
    { img: qc1, alt: "qc1" },
    { img: qc3, alt: "qc3" },
    {
      img: "https://cdn1.fahasa.com/media/magentothem/banner7/Mainbanner_1503_840x320.png",
      alt: "",
    },
    {
      img: "https://cdn1.fahasa.com/media/magentothem/banner7/BlingboxT125_840X320_1.jpg",
      alt: "",
    },
    {
      img: "https://cdn1.fahasa.com/media/magentothem/banner7/hoisacht3_840x320_2.jpg",
      alt: "",
    },
  ];


  
  return (
    <div className="home-container">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="ad-slider"
      >
        {ads.map((ad, index) => (
          <SwiperSlide key={index}>
            <img src={ad.img} alt={ad.alt} className="ad-banner" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Home;
