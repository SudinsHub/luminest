/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const path = require('path')
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const publicProductRoutes = require('./routes/publicProductRoutes');
const publicCategoryRoutes = require('./routes/publicCategoryRoutes');
const publicCarouselRoutes = require('./routes/publicCarouselRoutes');
const publicBannerRoutes = require('./routes/publicBannerRoutes');
const publicCouponRoutes = require('./routes/publicCouponRoutes');
const publicTagRoutes = require('./routes/publicTagRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));
app.use('/uploads/carousel', express.static(path.join(__dirname, 'uploads/carousel')));
app.use('/uploads/categories', express.static(path.join(__dirname, 'uploads/categories')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/products', publicProductRoutes);
app.use('/api/categories', publicCategoryRoutes);
app.use('/api/carousel', publicCarouselRoutes);
app.use('/api/banner', publicBannerRoutes);
app.use('/api/coupons', publicCouponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tags', publicTagRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
});


module.exports = app;
