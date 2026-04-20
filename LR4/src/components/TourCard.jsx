import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TourCard({ tour, onBook, isBooked, user }) {
  const [showAuthMsg, setShowAuthMsg] = useState(false);

  const handleBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowAuthMsg(true);
      return;
    }
    if (!isBooked) onBook(tour);
  };

  return (
    <Link to={`/tour/${tour.id}`} style={{ textDecoration: 'none' }}>
      <div className={`tour-card ${isBooked ? 'is-booked' : ''}`}>
        <div 
          className="card-img" 
          style={{ backgroundImage: `url(${tour.img})` }}
        ></div>
        
        <div className="card-info">
          <h3>{tour.title}</h3>
          <p><i>{tour.hotel || tour.departure || "Найкраща пропозиція"}</i></p>
          
          <p className="price">${tour.price}</p>

          <button 
            className="buy-btn" 
            onClick={handleBook}
            style={isBooked ? { background: '#008e95', cursor: 'default', opacity: 0.8 } : {}}
          >
            {isBooked ? 'ЗАБРОНЬОВАНО ✓' : 'ЗАБРОНЮВАТИ'}
          </button>

          {showAuthMsg && (
            <p className="auth-msg">
              Щоб забронювати, будь ласка <Link to="/auth" onClick={(e) => e.stopPropagation()}>увійдіть</Link>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}