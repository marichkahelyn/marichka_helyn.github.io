import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    await addDoc(collection(db, 'messages'), {
      name,
      email,
      subject,
      message,
      createdAt: serverTimestamp(),
    });
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="contact-container">
      <div className="banner">
        <div className="border-box">
          <h2 style={{color: '#FFFFFF'}}>НАШІ КОНТАКТИ</h2>
        </div>
      </div>
      <div className="contact-glass-box">
        <div className="contact-form-area">
          <h3>НАПИШІТЬ НАМ</h3>
          <form className="main-form">
            <input type="text" placeholder="Ваше ім'я" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Ваш Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Тема повідомлення" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <textarea placeholder="Ваше запитання..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            {sent && <p style={{ color: '#00bcd4', textAlign: 'center' }}>✓ Повідомлення надіслано!</p>}
            <button type="button" className="buy-btn" onClick={handleSubmit}>
              ВІДПРАВИТИ ПОВІДОМЛЕННЯ
            </button>
          </form>
        </div>
        <div className="contact-info-area">
          <h3>НАШ ОФІС</h3>
          <div className="map-wrapper" style={{ marginTop: "20px", marginBottom: "20px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2572.5414606775!2d24.0197823768853!3d49.85104443033589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add0901e51b1b%3A0xc6ed7b137353982e!2zcHJvc3Bla3QgVnlhY2hlc2xhdmEgQ2hvcm5vdm9sYSwgNTksIEx2aXYsIEx2aXYgT2JsYXN0LCA3OTAwMA!5e0!3m2!1sen!2sua!4v1711750000000!5m2!1sen!2sua"
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="detail-item">
            <strong>АДРЕСА:</strong>
            <p>м. Львів, проспект В'ячеслава Чорновола, 59</p>
          </div>
          <div className="detail-item">
            <strong>ТЕЛЕФОН:</strong>
            <p>0687832936</p>
          </div>
          <div className="detail-item">
            <strong>EMAIL:</strong>
            <p>support@vibetravel.ua</p>
          </div>
          <div className="detail-item">
            <strong>ГРАФІК:</strong>
            <p>Пн-Пт: 09:00 - 19:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}