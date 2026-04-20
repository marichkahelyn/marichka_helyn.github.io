import { useState, useEffect } from "react";
import TourCard from "./TourCard";
import InteractiveMap from "./InteractiveMap";

const popularPlaces = [
  {
    id: 1,
    title: "Лондон, Велика Британія",
    desc: "Столиця Великої Британії: Біг-Бен та затишні паби.",
    img: "/images/London.webp",
    lat: 51.505,
    lng: -0.09,
  },
  {
    id: 2,
    title: "Париж, Франція",
    desc: "Місто кохання: Ейфелева вежа та круасани.",
    img: "/images/Paris.webp",
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    id: 3,
    title: "Рим, Італія",
    desc: "Вічне місто: Колізей та смачна паста.",
    img: "/images/Rome.webp",
    lat: 41.9028,
    lng: 12.4964,
  },
  {
    id: 4,
    title: "Берлін, Німеччина",
    desc: "Місто історії та сучасного мистецтва.",
    img: "/images/Berlin.webp",
    lat: 52.52,
    lng: 13.405,
  },
];

export default function HotTours({ allTours, onBook, bookedIds = [], user }) {
  const [tours, setTours] = useState([]);
  const [activePlace, setActivePlace] = useState(null);

  useEffect(() => {
    if (allTours && allTours.length > 0) {
      setTours(allTours);
    }
  }, [allTours]);

  const handleSort = () => {
    const sorted = [...tours].sort((a, b) => a.price - b.price);
    setTours(sorted);
  };

  return (
    <div>
      <div className="banner">
        <div className="border-box">
          <h2 style={{ color: '#FFFFFF' }}>ПОПУЛЯРНІ МІСЦЯ</h2>
        </div>
      </div>

      <div className="interactive-map">
        <InteractiveMap places={popularPlaces} onHover={setActivePlace} />
        {activePlace && (
          <div className="map-tooltip">
            <img
              id="tooltip-img"
              src={activePlace.img}
              alt={activePlace.title}
              style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
            />
            <h4 id="tooltip-title" style={{ color: "black", marginBottom: "5px" }}>
              {activePlace.title}
            </h4>
            <p id="tooltip-desc" style={{ color: "black", fontSize: "0.9rem" }}>
              {activePlace.desc}
            </p>
          </div>
        )}
      </div>

      <div className="banner" style={{ marginTop: "60px" }}>
        <div className="border-box">
          <h2 style={{ color: '#FFFFFF' }}>ГАРЯЧІ ТУРИ</h2>
          <button
            onClick={handleSort}
            className="buy-btn"
            style={{ marginTop: "15px", width: "auto" }}
          >
            СОРТУВАТИ ЗА ЦІНОЮ
          </button>
        </div>
      </div>

      <div className="tour-box">
        {tours.length > 0 ? (
          tours.map((t) => (
            <TourCard
              key={t.id}
              tour={t}
              onBook={onBook}
              isBooked={bookedIds.includes(t.id)}
              user={user}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%", color: "white" }}>
            Завантаження турів...
          </p>
        )}
      </div>
    </div>
  );
}