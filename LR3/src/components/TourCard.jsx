import React from 'react';

// 1. Прибираємо bookedIds, додаємо isBooked у пропси
export default function TourCard({ tour, onBook, isBooked }) {

  return (
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
          onClick={() => !isBooked && onBook(tour)}
          // Стиль для заброньованої кнопки
          style={isBooked ? { background: '#008e95', cursor: 'default', opacity: 0.8 } : {}}
        >
          {isBooked ? 'ЗАБРОНЬОВАНО ✓' : 'ЗАБРОНЮВАТИ'}
        </button>
      </div>
    </div>
  );
}