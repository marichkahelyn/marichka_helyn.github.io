import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import HotTours from "./components/HotTours";
import BookingList from "./components/BookingList";
import ContactPage from "./components/ContactPage";
import AuthPage from "./components/AuthPage";
import TourPage from "./components/TourPage";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [tours, setTours] = useState([]);
  const [booked, setBooked] = useState([]);
  const [bookedIds, setBookedIds] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/tours`)
      .then((res) => res.json())
      .then((data) => setTours(data))
      .catch((err) => console.error(err));
  }, []);

  const handleBooking = (tour) => {
    if (!bookedIds.includes(tour.id)) {
      setBooked([...booked, { ...tour, status: "confirmed" }]);
      setBookedIds([...bookedIds, tour.id]);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
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
              <li>
                <Link to="/">ГАРЯЧІ ТУРИ</Link>
              </li>
              {user && (
                <li>
                  <Link to="/bookings">МОЇ БРОНЮВАННЯ ({booked.length})</Link>
                </li>
              )}
              <li>
                <Link to="/contacts">КОНТАКТИ</Link>
              </li>
              {user ? (
                <>
                  <li className="user-email">{user.email}</li>
                  <li>
                    <button onClick={handleSignOut} className="signout-btn">
                      Вийти
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/auth">УВІЙТИ</Link>
                </li>
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
            <Route
              path="/bookings"
              element={<BookingList bookedTours={booked} />}
            />
            <Route
              path="/tour/:id"
              element={<TourPage user={user} apiUrl={API_URL} />}
            />
            <Route
              path="/contacts"
              element={<ContactPage apiUrl={API_URL} />}
            />
            <Route
              path="/auth"
              element={<AuthPage setUser={setUser} apiUrl={API_URL} />}
            />
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
