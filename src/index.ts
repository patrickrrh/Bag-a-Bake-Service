import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import regionRoutes from './routes/regionRoutes';
import bakeryRoutes from './routes/bakeryRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import orderCustomerRoutes from './routes/orderCustomerRoutes';
import orderSellerRoutes from './routes/orderSellerRoutes';
import ratingRoutes from './routes/ratingRoutes';

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'X-Auth-Token'],
}))

app.use(express.json());

const apiRouter = express.Router();

apiRouter.use(authRoutes);
apiRouter.use(productRoutes);
apiRouter.use(categoryRoutes);
apiRouter.use(regionRoutes);
apiRouter.use(bakeryRoutes);
apiRouter.use(favoriteRoutes);
apiRouter.use(orderCustomerRoutes);
apiRouter.use(orderSellerRoutes);
apiRouter.use(ratingRoutes)

app.use('/api', apiRouter);

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
})