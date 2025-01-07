import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import bakeryRoutes from './routes/bakeryRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import orderCustomerRoutes from './routes/orderCustomerRoutes';
import orderSellerRoutes from './routes/orderSellerRoutes';
import ratingRoutes from './routes/ratingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'X-Auth-Token'],
}))

app.use(express.json({ limit: '100mb' }));

const apiRouter = express.Router();

apiRouter.use(authRoutes);
apiRouter.use(productRoutes);
apiRouter.use(categoryRoutes);
apiRouter.use(bakeryRoutes);
apiRouter.use(favoriteRoutes);
apiRouter.use(orderCustomerRoutes);
apiRouter.use(orderSellerRoutes);
apiRouter.use(ratingRoutes);
apiRouter.use(paymentRoutes);

app.use('/images/:type', (req, res, next) => {
    const { type } = req.params;
    
    if (['profile', 'product', 'bakery-image', 'bakery-halal-certificate', 'bakery-qris', 'proof-of-payment'].includes(type)) {
      const folderPath = path.join(__dirname, '..', '..', 'public_html', 'uploads', type);
      return express.static(folderPath)(req, res, next);
    } else {
      return res.status(400).send('Invalid image type');
    }
  });
  
app.use('/api', apiRouter);

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
})