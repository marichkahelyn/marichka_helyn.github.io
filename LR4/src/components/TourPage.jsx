import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

export default function TourPage({ user }) {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Завантажуємо тур з Firestore
  useEffect(() => {
    const fetchTour = async () => {
      const snapshot = await getDocs(collection(db, "tours"));
      const found = snapshot.docs.map((d) => d.data()).find((t) => t.id === id);
      setTour(found);
    };
    fetchTour();
  }, [id]);

  // Завантажуємо відгуки
  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(collection(db, "reviews"), where("tourId", "==", id));
      const snapshot = await getDocs(q);
      setReviews(snapshot.docs.map((d) => d.data()));
    };
    fetchReviews();
  }, [id, submitted]);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) return;
    await addDoc(collection(db, "reviews"), {
      tourId: id,
      email: user.email,
      rating,
      comment,
      createdAt: serverTimestamp(),
    });
    setComment("");
    setRating(0);
    setSubmitted(!submitted);
  };

  if (!tour)
    return (
      <p style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>
        Завантаження...
      </p>
    );

  return (
    <div className="tour-page">
      <Link to="/" className="back-btn">
        ← Назад
      </Link>

      <div
        className="tour-page-hero"
        style={{ backgroundImage: `url(${tour.img})` }}
      >
        <div className="tour-page-overlay">
          <h1>{tour.title}</h1>
          <p>{tour.hotel}</p>
          <p className="price">${tour.price}</p>
          <p>Дата вильоту: {tour.departure}</p>
        </div>
      </div>

      <div className="reviews-section">
        <h2>ВІДГУКИ</h2>
        {reviews.length > 0 && (
          <div className="avg-rating">
            <span className="stars">
              {"★".repeat(
                Math.round(
                  reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length,
                ),
              )}
              {"☆".repeat(
                5 -
                  Math.round(
                    reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length,
                  ),
              )}
            </span>
            <span>
              {(
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              ).toFixed(1)}{" "}
              / 5 ({reviews.length}{" "}
              {reviews.length === 1 ? "відгук" : "відгуків"})
            </span>
          </div>
        )}
        {reviews.length === 0 && (
          <p className="no-reviews">Відгуків ще немає. Будьте першим!</p>
        )}

        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            <div className="review-header">
              <span className="review-email">{r.email}</span>
              <span className="review-stars">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
            </div>
            <p className="review-comment">{r.comment}</p>
          </div>
        ))}

        {user ? (
          <div className="review-form">
            <h3>Залишити відгук</h3>
            <div className="stars-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hovered || rating) ? "active" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Ваш відгук..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="review-textarea"
            />
            <button className="buy-btn" onClick={handleSubmit}>
              НАДІСЛАТИ
            </button>
          </div>
        ) : (
          <p
            className="auth-msg"
            style={{ fontSize: "16px", marginTop: "20px" }}
          >
            Щоб залишити відгук, <Link to="/auth">увійдіть</Link>
          </p>
        )}
      </div>
    </div>
  );
}
