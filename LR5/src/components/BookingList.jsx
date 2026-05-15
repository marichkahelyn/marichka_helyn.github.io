import React from 'react';

export default function BookingList({ bookedTours = [] }) {
  const getStatusBadge = () => {
    return <span className="status-done">ПІДТВЕРДЖЕНО</span>;
  };

  return (
    <div className="bookings-page">
      <div className="banner">
        <div className="border-box">
          <h2 style={{color: '#FFFFFF' }}>МОЇ БРОНЮВАННЯ</h2>
        </div>
      </div>

      <div className="booking-container">
        {!bookedTours || bookedTours.length === 0 ? (
          <div className="empty-msg" style={{ textAlign: 'center', marginTop: '50px' }}>
            <span style={{ opacity: 0.7 }}>Ви ще не обрали жодного туру.</span>
          </div>
        ) : (
          bookedTours.map((tour, index) => (
            <div key={tour.id || index} className="booking-card">
              <div className="booking-header">
                {getStatusBadge()}
                <span className="order-id">ID: {tour.id || 'N/A'}</span>
              </div>

              <div className="booking-body">
                <h3>{tour.title}</h3>
                <p><strong>Дата вильоту:</strong> {tour.departure || 'Уточнюється'}</p>
                <p><strong>Готель:</strong> {tour.hotel || 'Standard Hotel'}</p>
                <p><strong>Оплата:</strong> ${tour.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}