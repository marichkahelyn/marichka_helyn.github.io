const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Роздача зібраного фронтенду
app.use(express.static(path.join(__dirname, '..', 'dist')));

// --- AUTH MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// --- REGISTER ---
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
});

// --- LOGIN ---
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Невірний email або пароль' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Невірний email або пароль' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
});

// --- GET PROFILE ---
app.get('/api/auth/profile', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    next(err);
  }
});

// --- GET TOURS ---
app.get('/api/tours', async (req, res, next) => {
  try {
    const tours = await prisma.tour.findMany();
    res.json(tours);
  } catch (err) {
    next(err);
  }
});

// --- GET REVIEWS FOR TOUR ---
app.get('/api/tours/:id/reviews', async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { tourId: req.params.id },
      include: { user: { select: { email: true } } },
      orderBy: { rating: 'desc' },
    });
    const avg = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    res.json({ reviews, averageRating: parseFloat(avg.toFixed(2)) });
  } catch (err) {
    next(err);
  }
});

// --- POST REVIEW ---
const bannedWords = ['жахливо', 'жахлива', 'обман', 'шахрайство', 'краде'];

app.post('/api/tours/:id/reviews', authenticate, async (req, res, next) => {
  try {
    const { comment, rating } = req.body;
    const hasBanned = bannedWords.some(word => comment.toLowerCase().includes(word));
    if (hasBanned) {
      return res.status(400).json({ message: 'Відгук містить заборонені слова' });
    }
    const review = await prisma.review.create({
      data: { comment, rating, tourId: req.params.id, userId: req.userId },
      include: { user: { select: { email: true } } },
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

// --- POST MESSAGE ---
app.post('/api/messages', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Заповніть всі обов\'язкові поля' });
    }
    const saved = await prisma.message.create({
      data: { name, email, subject, message },
    });
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// --- SPA FALLBACK ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// --- ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));