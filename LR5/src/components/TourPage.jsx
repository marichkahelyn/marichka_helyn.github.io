import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function TourPage({ user, apiUrl }) {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/api/tours`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(t => t.id === id);
        setTour(found);
      });
  }, [id]);

  useEffect(() => {
    fetch(`${apiUrl}/api/tours/${id}/reviews`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
      });
  }, [id]);

  const handleSubmit = async () => {
    setError('');
    if (!rating || !comment.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/tours/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ comment, rating }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Помилка');
        return;
      }

      setReviews(prev => [data, ...prev]);
      const newAvg = [...reviews, data].reduce((sum, r) => sum + r.rating, 0) / (reviews.length + 1);
      setAverageRating(parseFloat(newAvg.toFixed(2)));
      setComment('');
      setRating(0);
    } catch (err) {
      setError('Помилка з\'єднання з сервером');
    } finally {
      setLoading(false);
    }
  };

  if (!tour) return (
    <p style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>
      Завантаження...
    </p>
  );

  return (
    <div className="tour-page">
      <Link to="/" className="back-btn">← Назад</Link>

      <div className="tour-page-hero" style={{ backgroundImage: `url(${tour.img})` }}>
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
              {'★'.repeat(Math.round(averageRating))}
              {'☆'.repeat(5 - Math.round(averageRating))}
            </span>
            <span>{averageRating} / 5 ({reviews.length} {reviews.length === 1 ? 'відгук' : 'відгуків'})</span>
          </div>
        )}

        {reviews.length === 0 && (
          <p className="no-reviews">Відгуків ще немає. Будьте першим!</p>
        )}

        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            <div className="review-header">
              <span className="review-email">{r.user?.email || r.email}</span>
              <span className="review-stars">
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </span>
            </div>
            <p className="review-comment">{r.comment}</p>
          </div>
        ))}

        {user ? (
          <div className="review-form">
            <h3>Залишити відгук</h3>
            <div className="stars-input">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= (hovered || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                >★</span>
              ))}
            </div>
            <textarea
              placeholder="Ваш відгук..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="review-textarea"
            />
            {error && <p className="auth-error">{error}</p>}
            <button className="buy-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Надсилання...' : 'НАДІСЛАТИ'}
            </button>
          </div>
        ) : (
          <p className="auth-msg" style={{ fontSize: '16px', marginTop: '20px' }}>
            Щоб залишити відгук, <Link to="/auth">увійдіть</Link>
          </p>
        )}
      </div>
    </div>
  );
}