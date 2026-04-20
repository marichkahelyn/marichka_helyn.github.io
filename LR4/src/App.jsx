import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import HotTours from './components/HotTours';
import BookingList from './components/BookingList';
import ContactPage from './components/ContactPage';
import AuthPage from './components/AuthPage';
import TourPage from './components/TourPage';
import './App.css';

function App() {
  const [tours, setTours] = useState([]);
  const [booked, setBooked] = useState([]);
  const [bookedIds, setBookedIds] = useState([]);
  const [user, setUser] = useState(null);

  // Відстежуємо стан автентифікації
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Завантажуємо тури з Firestore
  useEffect(() => {
    const fetchTours = async () => {
      const snapshot = await getDocs(collection(db, 'tours'));
      const toursData = snapshot.docs.map(doc => doc.data());
      setTours(toursData);
    };
    fetchTours();
  }, []);

  const handleBooking = (tour) => {
    if (!bookedIds.includes(tour.id)) {
      setBooked([...booked, { ...tour, status: 'confirmed' }]);
      setBookedIds([...bookedIds, tour.id]);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <Router>
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
              {user ? (
                <>
                  <li className="user-email">{user.email}</li>
                  <li><button onClick={handleSignOut} className="signout-btn">Вийти</button></li>
                </>
              ) : (
                <li><Link to="/auth">УВІЙТИ</Link></li>
              )}
            </ul>
          </nav>
        </header>

        <main className="content">
          <Routes>
            <Route
              path="/"
              element={
                <HotTours
                  allTours={tours}
                  onBook={handleBooking}
                  bookedIds={bookedIds}
                  user={user}
                />
              }
            />
            <Route path="/bookings" element={<BookingList bookedTours={booked} />} />
            <Route path="/tour/:id" element={<TourPage user={user} />} />
            <Route path="/contacts" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />
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