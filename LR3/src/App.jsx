import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import HotTours from './components/HotTours';
import BookingList from './components/BookingList';
import ContactPage from './components/ContactPage';
import './App.css';

function App() {
  const [tours, setTours] = useState([]);
  const [booked, setBooked] = useState([]);
  const [bookedIds, setBookedIds] = useState([]); 

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}tours.json`)  // ← виправлено
      .then((response) => {
        if (!response.ok) throw new Error('Помилка при завантаженні даних');
        return response.json();
      })
      .then((data) => setTours(data))
      .catch((error) => console.error("Помилка:", error));
  }, []);

  const handleBooking = (tour) => {
    if (!bookedIds.includes(tour.id)) {
      setBooked([...booked, { ...tour, status: 'confirmed' }]);
      setBookedIds([...bookedIds, tour.id]);
    }
  };

  return (
    <Router>
      {/* Клас main-bg має займати 100% ширини (Зауваження №1) */}
      <div className="main-bg">
        <header className="header">
          <div className="logo">
            <div className="logo-box">
              VIBETRAVEL
              <span>Best Prices, Best Holidays</span>
            </div>
          </div>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">ГАРЯЧІ ТУРИ</Link></li>
              <li><Link to="/bookings">МОЇ БРОНЮВАННЯ ({booked.length})</Link></li>
              <li><Link to="/contacts">КОНТАКТИ</Link></li>
            </ul>
          </nav>
        </header>

        {/* Контейнер content має розтягуватися в App.css */}
        <main className="content">
          <Routes>
            <Route 
              path="/" 
              element={
                <HotTours 
                  allTours={tours} // Передаємо дані, завантажені через fetch
                  onBook={handleBooking} 
                  bookedIds={bookedIds} 
                />
              } 
            />
            <Route path="/bookings" element={<BookingList bookedTours={booked} />} />
            <Route path="/contacts" element={<ContactPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="f-links">
             <a href="#">INSTAGRAM</a>
             <a href="#">FACEBOOK</a>
             <a href="#">TELEGRAM</a>
          </div>
          <p>© 2026 VibeTravel. Всі права захищені.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;